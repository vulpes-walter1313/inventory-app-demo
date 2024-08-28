import db from "../db/pool";
type Product = {
  id: number;
  name: string;
  description: string;
  category_id: number;
  category_name: string;
  category_slug: string;
  price: string;
  in_stock: number;
  slug: string;
};

type ProductList = Product[];
type CreateProductProps = Omit<
  Product,
  "category_name" | "category_slug" | "id"
>;
type GetProductsPayload = {
  limit: number;
  page: number;
  categoryId?: number;
};
async function getProducts({ limit, page, categoryId }: GetProductsPayload) {
  if (categoryId) {
    const offset = (page - 1) * limit;
    const { rows } = await db.query(
      `SELECT
    i.id AS id,
    i.name AS name,
    i.description AS description,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    price,
    in_stock,
    i.slug AS slug
    FROM instruments i
    JOIN categories c
    ON i.category_id = c.id
    WHERE category_id = $1
    ORDER BY i.name
    LIMIT $2 OFFSET $3
`,
      [categoryId, limit, offset],
    );
    return rows as ProductList;
  } else {
    const offset = (page - 1) * limit;
    const { rows } = await db.query(
      `SELECT
    i.id AS id,
    i.name AS name,
    i.description AS description,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    price,
    in_stock,
    i.slug AS slug
    FROM instruments i
    JOIN categories c
    ON i.category_id = c.id
    ORDER BY i.name
    LIMIT $1 OFFSET $2
`,
      [limit, offset],
    );
    return rows as ProductList;
  }
}

// Gets total count of how many products there are
async function getCount(categoryId?: number) {
  if (categoryId) {
    const { rows } = await db.query(
      `SELECT COUNT(id) AS count
      FROM instruments
      WHERE category_id = $1`,
      [categoryId],
    );
    return rows[0].count as number;
  } else {
    const { rows } = await db.query(`SELECT COUNT(id) AS count
      FROM instruments`);
    return rows[0].count as number;
  }
}

type GetProductsByIdPayload = {
  limit: number;
  page: number;
  categoryId: number;
};

async function getProductsByCategoryId({
  categoryId,
  limit,
  page,
}: GetProductsByIdPayload) {
  // the ternary is to ensure that if page is 0
  // to turn it into 1. this prevents a sql error
  // where offset is negative.
  const offset = (page === 0 ? 1 : page - 1) * limit;
  const { rows } = await db.query(
    `SELECT
    i.id AS id,
    i.name AS name,
    i.description AS description,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    price,
    in_stock,
    i.slug AS slug
    FROM instruments i
    JOIN categories c
    ON i.category_id = c.id
    WHERE i.category_id = $1
    ORDER BY i.name
    OFFSET $2 ROWS
    FETCH FIRST $3 ROWS ONLY
`,
    [categoryId, offset, limit],
  );
  return rows as ProductList;
}

async function getProductBySlug(slug: string) {
  const { rows } = await db.query(
    `SELECT
    i.id AS id,
    i.name AS name,
    i.description AS description,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    price,
    in_stock,
    i.slug AS slug
    FROM instruments i
    JOIN categories c
    ON i.category_id = c.id
    WHERE i.slug = $1
`,
    [slug],
  );
  const product = rows[0] as Product;
  return product;
}

async function getProductById(id: number) {
  const { rows } = await db.query(
    `SELECT
    i.id AS id,
    i.name AS name,
    i.description AS description,
    c.id AS category_id,
    c.name AS category_name,
    c.slug AS category_slug,
    price,
    in_stock,
    i.slug AS slug
    FROM instruments i
    JOIN categories c
    ON i.category_id = c.id
    WHERE i.id = $1
`,
    [id],
  );
  const product = rows[0] as Product;
  return product;
}
async function createProduct({
  name,
  description,
  category_id,
  price,
  in_stock,
  slug,
}: CreateProductProps) {
  await db.query(
    `INSERT INTO instruments(name, description, category_id, price, in_stock, slug)
    VALUES
    ($1, $2, $3, $4, $5, $6)
`,
    [name, description, category_id, price, in_stock, slug],
  );
}

async function updateProductBySlug(
  { name, description, category_id, price, in_stock, slug }: CreateProductProps,
  productSlug: string,
) {
  await db.query(
    `UPDATE instruments
    SET name = $1,
    description = $2, 
    category_id = $3,
    price = $4,
    in_stock = $5,
    slug = $6
    WHERE slug = $7
`,
    [name, description, category_id, price, in_stock, slug, productSlug],
  );
}
async function updateProductById(
  { name, description, category_id, price, in_stock, slug }: CreateProductProps,
  productId: number,
) {
  await db.query(
    `UPDATE instruments
    SET name = $1,
    description = $2, 
    category_id = $3,
    price = $4,
    in_stock = $5,
    slug = $6
    WHERE id = $7
`,
    [name, description, category_id, price, in_stock, slug, productId],
  );
}

async function deleteProductBySlug(slug: string) {
  await db.query(
    `DELETE FROM instruments
    WHERE slug = $1   
`,
    [slug],
  );
}

async function deleteProductById(id: number) {
  await db.query(
    `DELETE FROM instruments
    WHERE id = $1   
`,
    [id],
  );
}

export default {
  getCount,
  getProducts,
  getProductsByCategoryId,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProductBySlug,
  updateProductById,
  deleteProductBySlug,
  deleteProductById,
};
