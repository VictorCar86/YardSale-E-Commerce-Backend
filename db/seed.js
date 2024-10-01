const sequelize = require("../libs/sequelize");

(async () => {
    /* Validate DB Connection And Set Services */
    try {
        await sequelize.authenticate();
    } catch (err) {
        console.error("Unable to connect to the database:", err); // eslint-disable-line
    }

    /* Set Services */
    const ProductsService = require("../services/products.services");
    const CategoriesService = require("../services/categories.services");
    const CustomersService = require("../services/customer.services");

    // /* Drop Tables */
    // try {
    //     await sequelize.drop();
    // } catch (err) {
    //     console.error("Unable to drop tables:", err); // eslint-disable-line
    // }

    /* Grow Seed */
    await seedTestUser();
    await seedCategories();
    await seedProducts();

    /* Functions */

    // sourcery skip: avoid-function-declarations-in-blocks
    async function seedTestUser() {
        const user = {
            firstName: "admin",
            lastName: "admin",
            email: "admin@localhost.com",
            password: "admin123",
        };
        await new CustomersService().createCustomer(user);
    }

    async function seedCategories() {
        /* Set Categories In "name" Field */
        const categories = [
            "Clothes",
            "Electronics",
            "Toys",
            "Sports",
            "Books",
            "Others",
            "Furnitures",
        ];
        categories.forEach((category, i, a) => (a[i] = { name: category }));
        await new CategoriesService().createCategory(categories);
    }

    async function seedProducts() {
        /* Validate And Parse Seed Value */
        const Joi = require("joi");
        let seedRounds = process.env.SEED_ROUNDS;
        const seedSchema = Joi.number().integer().greater(0).required();
        const { error, value } = seedSchema.validate(seedRounds);
        if (error) {
            console.error(error); // eslint-disable-line
            return;
        }
        seedRounds = value;

        /* Seed Data */
        const { faker } = require("@faker-js/faker");
        const products = [];
        const categories = await new CategoriesService().returnCategories();
        categories.forEach((category) => {
            for (let i = 0; i < seedRounds; i++) {
                products.push({
                    categoryId: category.id,
                    name: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    price: faker.commerce.price(),
                    image: faker.image.url({
                        category: category.name.toLowerCase(),
                        height: 200,
                        width: 200,
                    }),
                });
            }
        });
        await new ProductsService().createProduct(products);
    }
})();
