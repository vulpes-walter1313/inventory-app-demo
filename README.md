# Inventory-app

This is my attempt at [TheOdinProject's Inventory App Project](https://www.theodinproject.com/lessons/nodejs-inventory-application)

## Models

### DB Connection

This app uses a postgres database so the ENV variable `DB_URL` should be a postgres connection string like this

```Text
postgresql://<username>:<password>@<domain or localhost>:<port or 5432 default>/<database name>
```

### Instruments

```sql
CREATE TABLE IF NOT EXISTS instruments (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(256) NOT NULL,
  description VARCHAR(2040),
  category_id INT NOT NULL
  price DEC(10,2) NOT NULL,
  in_stock INT,
  slug VARCHAR(100) NOT NULL UNIQUE
  PRIMARY KEY(id),
  CONSTRAINT fk_category
    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE CASCADE
);
```

### Categories

```SQL
CREATE TABLE IF NOT EXISTS categories (
  id INT GENERATED ALWAYS AS IDENTITY,
  name VARCHAR(20) NOT NULL,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(256),
  PRIMARY KEY(id)
);
```

## Routes

### GET `/` Homepage

This page will show all categories and a list of the latest 3 items.

### GET `/categories`

This page will just show all the categories in the system. Clicking ay one of them will allow you to view products in that category.

### GET `/category/create` page

this page will have a form to create a new category. The form will take in the following:

- name
- slug
- description

`name` is the category name that will be displayed in the app. `slug` is a readable slug that represents the category in the uri, like `/category/guitars` for example. `description` is a short (< 256 char) desccreiption of the category. This description will be used in the category page showing all the products in that category.

### POST `/category`

This endpoint will take a form body with:

- name
- slug
- description

it will validate the data and if valid, it will create a new category, then redirect to the homepage. if data is invalid then it will rerender the GET `/category/create` form with validation errors presented.

### GET `/category/:categorySlug`

This will be a page that shows all the products in that category.

### GET `/category/:categorySlug/edit`

this page will be the same form as in GET `/category/create` but prefilled with data from the category in question.

### PUT `/category/:categorySlug`

This endpoint will update the category in question. Validation will ensure data is consistent. If validation fails, the GET `/category/:categorySlug/edit` page will be rerendered with validation errors.

### GET `/category/:categorySlug/delete`

This page will show a delete confirmation page. If the category to be deleted still has products assigned to the category, then some of those products will appear and a message saying that those products must be either deleted or recategorized in order to delete the category.

If the category doesn't have products then a delete button will show up that triggers the actual deletion of the category.

### DELETE `/category/:categorySlug`

This endpoint will first verify that there are no products in the category. If there are products in that category then DELETE action is rejected. If category has no products then DELETE action will be done.

### GET `/products`

This page will just list out all products in alphabetical order by name. The results will be paginated.

### GET `/product/create`

This page will have a form to create a new product. It will contain the following fields

- name
- description
- category (select input)
- price
- in_stock (number input)
- slug

### POST `/product`

This endpoint will verify all fields from GET `/product/create`. If validation is valid, a new product will be created. If validation fails, the GET `/product/create` page will be rerendered with the validation errors.

### GET `/product/:productSlug`

This page will show all information of the product in question.

### GET `/product/:productSlug/edit`

This page will show the same form as GET `/product/create` but with the fields prefilled with the data from the product in question. Submission will be to PUT `/product/:productSlug`.

### PUT `/product/:productSlug`

This endpoint will validate the FormData to ensure it's consistent and if valid, the product data will be updated and will be redirected to that products page GET `/product/:productSlug`. If validation fails then the GET `/product/:productSlug/edit` page will be rerendered with the validation errors.

### GET `/product/:productSlug/delete`

This page will show the product in question and ask for confirmation if you want to delete the product.

### DELETE `/product/:productSlug`

This endpoint will delete the product and redirect to GET `/`
