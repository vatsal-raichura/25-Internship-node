const routes = require("express").Router()

const productController = require("../controllers/ProductController")
routes.get("/product",productController.getAllProduct)
routes.post("/products",productController.addProduct)

routes.get('/productsbybusinessid/:businessId', productController.getAllProductByBusinessId);
routes.get('/getProductById/:id', productController.getProductById);
routes.put('/updateproduct/:id', productController.updateProduct);


routes.delete("/product/:id",productController.deleteProduct)

routes.post('/addWithFile', productController.addProductWithFile);



module.exports = routes