import { cart,removeFromCart, updateDeliveryOption } from "../../data/cart.js";   
import { products,getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
//ESM Version import for dayjs
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions,getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";

/*-------------How to use dayjs -------------------------*/

/*
//using dayjs function
const today = dayjs();
//Add 7 days from today
const deliveryDate =  today.add(7,'days');

//Format the date
console.log(deliveryDate.format('dddd, MMMM D') ) 
*/

/*------------------------------------------------*/


/*--------------- Render the orderSummary page -----------------------------*/ 
export function renderOrderSummary()
{
    let cartSummaryHTML = '';

    cart.forEach((cartItem)=>
    { 
        const productId = cartItem.productId;
        
        //getting the product from the product.js file with the function
        const matchingProduct = getProduct(productId);

       

    /*------------------------------------------------------*/
        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId)

        const today =  dayjs();
            const deliveryDate = today.add(
            deliveryOption.deliveryDays,
            'days'

            );

            const dateString = deliveryDate.format(
            'dddd, MMMM D'
            );

    /*------------------------------------------------------*/


    cartSummaryHTML += `
            <div class="cart-item-container 
            js-cart-item-container-${matchingProduct.id}">
                    <div class="delivery-date">
                    Delivery date:${dateString} 
                    </div>

                    <div class="cart-item-details-grid">
                    <img class="product-image"
                        src="${matchingProduct.image}";
                    <div class="cart-item-details">
                        <div class="product-name">
                        ${matchingProduct.name}
                        </div>
                        <div class="product-price">
                        $${formatCurrency(matchingProduct.priceCents )}
                        </div>
                        <div class="product-quantity">
                        <span>
                            Quantity: <span class="quantity-label">${cartItem.quantity}</span>
                        </span>
                        <span class="update-quantity-link link-primary">
                            Update
                        </span>
                        <span class="delete-quantity-link link-primary js-delete-link" 
                        data-product-id="${matchingProduct.id}">
                            Delete
                        </span>
                        </div>
                    </div>

                    <div class="delivery-options">
                        <div class="delivery-options-title">
                        Choose a delivery option:
                        </div>
                    ${deliveryOptionHTML(matchingProduct,cartItem)}
                    </div>
                    </div>
                </div>

        `;
    });


    function deliveryOptionHTML(matchingProduct,cartItem)
    {
        let html = '';

        deliveryOptions.forEach((deliveryOption)=>
        {

            //get the date from dayjs and stored in the variable
            const today =  dayjs();

            //Add the deliveryDays from the today date
            //format const a = b.add(7,'day')
            //we just get the deliveryDays from the deliveryOptions
            const deliveryDate = today.add
            (
                deliveryOption.deliveryDays,'days'   
            );
            
            //convert the deliverDate to easy readable format 
            const dateString = deliveryDate.format(
                'dddd, MMMM D'
            );


            const priceString = deliveryOption.priceCents 
            === 0
            ? 'FREE'
            : `$${formatCurrency(deliveryOption.priceCents)} -`;


            const isChecked = deliveryOption.id === 
                cartItem.deliveryOptionId;

        html +=`
            <div class="delivery-option js-delivery-option"
            data-product-id="${matchingProduct.id}"
            data-delivery-option-id="${deliveryOption.id}"
            >
            <input type="radio"
            ${isChecked ? 'checked' : ''}
                class="delivery-option-input"
                name="delivery-option-${matchingProduct.id}">
            <div>
                <div class="delivery-option-date">
                ${dateString}
                </div>
                <div class="delivery-option-price">
                ${priceString}  Shipping
                </div>
            </div>
            </div>
        ` 
        })

        return html;

    }


    document.querySelector('.js-order-sumary')
        .innerHTML = cartSummaryHTML


    document.querySelectorAll('.js-delete-link')
        .forEach((link)=>
        {
            link.addEventListener('click',()=>
            {

            //using dataset getting the productid to delete the particular product
            const productId=  link.dataset.productId;

            //calling funtion
            removeFromCart(productId);
            
        const container=  document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();

        //After delete prodcut in the checkout regenerate the HTML code by calling this function
        renderPaymentSummary();
            })
        })    



    document.querySelectorAll('.js-delivery-option')
        .forEach((element)=>
        {
            element.addEventListener('click',()=>
            {
                //get those values out of the data attributes   
            const {productId,deliveryOptionId} = element.dataset;

            updateDeliveryOption(productId,deliveryOptionId);
            
            //After udpateDeliveryOption
            renderOrderSummary();
            //After choose the delivery option regenerate the HTML code        
            renderPaymentSummary();
            })
        })

}

