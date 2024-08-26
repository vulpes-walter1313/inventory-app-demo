import db from "../db/pool";
type Category = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
};
type CategoryList = Category[];
async function getCategories() {
  const { rows } = await db.query("SELECT * FROM categories ORDER BY name");
  return rows as CategoryList;
}
async function getCategoryBySlug(slug: string) {
  const { rows } = await db.query("SELECT * FROM categories WHERE slug = $1", [
    slug,
  ]);
  const category = rows[0];
  return category as Category;
}

async function getCategoryById(id: number) {
  const { rows } = await db.query("SELECT * FROM categories WHERE id = $1", [
    id,
  ]);
  const category = rows[0];
  return category as Category;
}

async function createCategory(name: string, slug: string, description: string) {
  await db.query(
    "INSERT INTO categories (name, slug, description) VALUES ($1, $2, $3)",
    [name, slug, description],
  );
}
type UpdateCategoryPayload = {
  name: string;
  slug: string;
  description: string;
};
async function updateCategoryBySlug(
  payload: UpdateCategoryPayload,
  slug: string,
) {
  await db.query(
    `UPDATE categories
    SET
      name = $1,
      slug = $2,
      description = $3
    WHERE slug = $4
    `,
    [payload.name, payload.slug, payload.description, slug],
  );
}
async function updateCategoryById(payload: UpdateCategoryPayload, id: number) {
  await db.query(
    `UPDATE categories
    SET
      name = $1,
      slug = $2,
      description = $3
    WHERE id = $4
    `,
    [payload.name, payload.slug, payload.description, id],
  );
}

async function deleteCategoryBySlug(slug: string) {
  await db.query(`DELETE FROM categories WHERE slug = $1`, [slug]);
}

async function deleteCategoryById(id: number) {
  await db.query(`DELETE FROM categories WHERE id = $1`, [id]);
}

export default {
  getCategories,
  getCategoryBySlug,
  getCategoryById,
  createCategory,
  updateCategoryBySlug,
  updateCategoryById,
  deleteCategoryBySlug,
  deleteCategoryById,
};
