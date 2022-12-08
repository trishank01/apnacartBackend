require("dotenv").config()
const express = require("express");
const cors = require("cors")
const path = require("path")
const app = express();
const bodyParser = require('body-parser')

//This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_PRIVATE_KEY);

app.use(cors({
  origin: "http://localhost:3000"
}))
app.use(express.json())



// if(process.env.NODE_ENV === "production"){
//        app.use(express.static("build"))
//        app.get("*" , (req , res) => {
//         res.sendFile(path.resolve(__dirname , "build" , "index.html"))
//        })
// }


const array = []
const calculateOrderAmount = (items) => {
  // Replace this constant with a calculation of the order's amount
  // Calculate the order total on the server to prevent
  // people from directly manipulating the amount on the client

  items.map((item ) => {
      const {price , cartQuanity} = item
      let cartItemsAmout = price * cartQuanity
      return array.push(cartItemsAmout)

  })

  const totalAmount = array.reduce((a, b) => {
    return a + b;
  }, 0);

  return totalAmount * 100
};






app.post("/create-payment-intent", async (req, res) => {
  const { items , shipping ,  desciption } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(items),
    currency: "INR",
    automatic_payment_methods: {
      enabled: true,
    },
    desciption, 
    shipping : {
         address : {
            line1 : shipping.line1,
            line2 : shipping.line2,
            city : shipping.city,
            country : shipping.country,
            postal_code : shipping.postal_code,
         },
         name : shipping.name,
         phone : shipping.phone
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});


app.get('/' , (req , res) => {
    res.send("Welcome to ApnaStore backend")
})

app.get('/check' , (req , res) => {
  res.send("Welcome to ApnaStore backend just for check")
})

const PORT = process.env.PORT || 4240
app.listen(PORT, () => console.log(`Node server listening on port ${PORT}!`));