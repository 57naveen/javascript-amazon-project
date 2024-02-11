import { cart} from '../../data/cart.js'
import { getProduct} from '../../data/products.js'
import {getDeliveryOption} from '../../data/deliveryOptions.js';
import {formatCurrency} from '../utils/money.js';


export function renderPaymentSummary() {

/*----------------------1.Save Data----------------------------------*/    
    let productPriceCents = 0;
    let shippingPriceCents = 0;

    cart.forEach((cartItem) => {
        const product = getProduct(cartItem.productId);

        productPriceCents += product.priceCents * cartItem.quantity;


        const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
        shippingPriceCents += deliveryOption.priceCents;

    });

    //calculate the total before tax 
    const totalBeforeTaxCents = productPriceCents + shippingPriceCents;

    //Calculate the 10% tax
    const taxCents =  totalBeforeTaxCents * 0.1;

   //Calculate the total
    const totalCents = totalBeforeTaxCents + taxCents;

  /*---------------------------END-------------------------------------*/  

 /*----------------------------2.Generate the HTML----------------------------------------*/

  //Generate the HTML
    const paymentSummaryHTML = 
    `
        <div class="payment-summary-title">
            Order Summary
        </div>

        <div class="payment-summary-row">
            <div>Items (3):</div>
            <div class="payment-summary-money">
            $${formatCurrency(productPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">
            $${formatCurrency(shippingPriceCents)}
            </div>
        </div>

        <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">$
            ${formatCurrency(totalBeforeTaxCents)}
            </div>
        </div>

        <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">$
            ${formatCurrency(taxCents)}</div>
        </div>

        <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">$
            ${formatCurrency(totalCents)}
            </div>
        </div>

        <button class="place-order-button button-primary">
            Place your order
        </button>
    `;

   //Put our generater  HTML code into the page 
    document.querySelector('.js-payment-summary')
        .innerHTML = paymentSummaryHTML;

}