import { knownFolders, path } from "@nativescript/core";
import { Product } from "../models/Product";
import { seedProducts } from "./seed-products";

declare const android: any;

type Row = Record<string, any>;

let db: any;

function dbPath() {
  return path.join(knownFolders.documents().path, "retail-pos.db");
}

function bindArgs(params: any[]) {
  const args = Array.create(java.lang.String, params.length);

  params.forEach((param, index) => {
    args[index] = String(param ?? "");
  });

  return args;
}

function requireDb() {
  if (!db) {
    db = android.database.sqlite.SQLiteDatabase.openOrCreateDatabase(dbPath(), null);
    db.execSQL("PRAGMA foreign_keys = ON");
    runMigrations();
    seedDemoProducts();
  }

  return db;
}

function exec(sql: string, params: any[] = []) {
  const database = requireDb();
  const statement = database.compileStatement(sql);

  try {
    params.forEach((param, index) => {
      const bindIndex = index + 1;

      if (param === null || param === undefined) {
        statement.bindNull(bindIndex);
      } else if (typeof param === "number") {
        statement.bindDouble(bindIndex, param);
      } else {
        statement.bindString(bindIndex, String(param));
      }
    });

    statement.execute();
  } finally {
    statement.close();
  }
}

function query(sql: string, params: any[] = []) {
  const cursor = requireDb().rawQuery(sql, bindArgs(params));
  const rows: Row[] = [];

  try {
    while (cursor.moveToNext()) {
      const row: Row = {};
      const columnCount = cursor.getColumnCount();

      for (let i = 0; i < columnCount; i++) {
        const name = cursor.getColumnName(i);
        const type = cursor.getType(i);

        if (type === android.database.Cursor.FIELD_TYPE_NULL) {
          row[name] = null;
        } else if (type === android.database.Cursor.FIELD_TYPE_INTEGER) {
          row[name] = cursor.getLong(i);
        } else if (type === android.database.Cursor.FIELD_TYPE_FLOAT) {
          row[name] = cursor.getDouble(i);
        } else {
          row[name] = cursor.getString(i);
        }
      }

      rows.push(row);
    }
  } finally {
    cursor.close();
  }

  return rows;
}

function runInTransaction(work: () => void) {
  const database = requireDb();
  database.beginTransaction();

  try {
    work();
    database.setTransactionSuccessful();
  } finally {
    database.endTransaction();
  }
}

function getVariantStock(variantId: string) {
  return Number(query("SELECT stock FROM product_variants WHERE id = ?", [variantId])[0]?.stock ?? 0);
}

function runMigrations() {
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      sub_category TEXT,
      price REAL NOT NULL,
      graphic_key TEXT
    )
  `);
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS product_variants (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      sku TEXT NOT NULL,
      barcode TEXT NOT NULL,
      size TEXT,
      color TEXT,
      stock INTEGER NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products(id)
    )
  `);
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS cart_items (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      size TEXT,
      color TEXT,
      FOREIGN KEY (product_id) REFERENCES products(id),
      FOREIGN KEY (variant_id) REFERENCES product_variants(id)
    )
  `);
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS sales (
      id TEXT PRIMARY KEY,
      created_at TEXT NOT NULL,
      subtotal REAL NOT NULL,
      tax REAL NOT NULL,
      total REAL NOT NULL
    )
  `);
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS sale_items (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      product_id TEXT NOT NULL,
      variant_id TEXT NOT NULL,
      name TEXT NOT NULL,
      qty INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id)
    )
  `);
  db.execSQL(`
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      sale_id TEXT NOT NULL,
      method TEXT NOT NULL,
      status TEXT NOT NULL,
      card_last4 TEXT,
      amount REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales(id)
    )
  `);
}

function seedDemoProducts() {
  const count = query("SELECT COUNT(*) AS count FROM products")[0]?.count || 0;

  if (count > 0) {
    return;
  }

  runInTransaction(() => {
    seedProducts.forEach(product => {
      exec(
        "INSERT INTO products (id, name, category, sub_category, price, graphic_key) VALUES (?, ?, ?, ?, ?, ?)",
        [product.id, product.name, product.category, product.subCategory, product.price, product.category]
      );

      product.variants.forEach(variant => {
        exec(
          "INSERT INTO product_variants (id, product_id, sku, barcode, size, color, stock) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [variant.id, product.id, variant.sku, variant.barcode, variant.size, variant.color, variant.stock]
        );
      });
    });
  });
}

export interface CartRow {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  sku: string;
  size?: string;
  color?: string;
  qty: number;
  price: number;
}

export const database = {
  initialize() {
    requireDb();
  },

  getProducts(): Product[] {
    const products = query("SELECT * FROM products ORDER BY id");
    const variants = query("SELECT * FROM product_variants ORDER BY id");

    return products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      subCategory: product.sub_category,
      price: product.price,
      variants: variants
        .filter(variant => variant.product_id === product.id)
        .map(variant => ({
          id: variant.id,
          sku: variant.sku,
          barcode: variant.barcode,
          size: variant.size,
          color: variant.color,
          stock: variant.stock
        }))
    }));
  },

  getCartItems(): CartRow[] {
    return query("SELECT * FROM cart_items ORDER BY rowid").map(item => ({
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      name: item.name,
      sku: item.sku,
      size: item.size,
      color: item.color,
      qty: item.qty,
      price: item.unit_price
    }));
  },

  getVariantStock(variantId: string) {
    return getVariantStock(variantId);
  },

  upsertCartItem(item: CartRow) {
    exec(
      `
        INSERT OR REPLACE INTO cart_items
        (id, product_id, variant_id, name, sku, qty, unit_price, size, color)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [item.id, item.productId, item.variantId, item.name, item.sku, item.qty, item.price, item.size, item.color]
    );
  },

  clearCart() {
    exec("DELETE FROM cart_items");
  },

  createSale(args: {
    subtotal: number;
    tax: number;
    total: number;
    cardLast4: string;
    items: CartRow[];
  }) {
    const saleId = `sale-${Date.now()}`;
    const createdAt = new Date().toISOString();

    runInTransaction(() => {
      exec("INSERT INTO sales (id, created_at, subtotal, tax, total) VALUES (?, ?, ?, ?, ?)", [
        saleId,
        createdAt,
        args.subtotal,
        args.tax,
        args.total
      ]);

      args.items.forEach((item, index) => {
        const stock = getVariantStock(item.variantId);

        if (stock < item.qty) {
          throw new Error(`Only ${stock} ${item.name} in stock.`);
        }

        exec(
          `
            INSERT INTO sale_items
            (id, sale_id, product_id, variant_id, name, qty, unit_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `,
          [`${saleId}-item-${index + 1}`, saleId, item.productId, item.variantId, item.name, item.qty, item.price]
        );

        exec("UPDATE product_variants SET stock = stock - ? WHERE id = ?", [item.qty, item.variantId]);
      });

      exec("INSERT INTO payments (id, sale_id, method, status, card_last4, amount) VALUES (?, ?, ?, ?, ?, ?)", [
        `${saleId}-payment`,
        saleId,
        "demo-card",
        "approved",
        args.cardLast4,
        args.total
      ]);

      exec("DELETE FROM cart_items");
    });

    return saleId;
  }
};
