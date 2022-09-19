import products from './products.js'

// Selectors

let productDivElm = document.querySelector('.products')
let cartItemsDivElm = document.querySelector('.cart-items') 
let subTotalElm = document.querySelector('.subtotal')
let cartTotalItemEm = document.querySelector('.total-items-in-cart')

// render products
function renderProducts(){
    products.forEach( product => {
        const htmlElm = `
        <div class="item">
        <div class="item-container">
            <div class="item-img">
                <img src="${product.imgSrc}" alt="t-shirt 1">
            </div>
            <div class="desc">
                <h2>${product.name}</h2>
                <h2><small>$</small>${product.price}</h2>
                <p>
                    ${product.description}
                </p>
            </div>
            <div class="add-to-wishlist">
                <img src="./icons/heart.png" alt="add to wish list">
            </div>
            <div class="id-${product.id} add-to-cart">
                <img src="./icons/bag-plus.png" alt="add to cart" class="id-${product.id}">
            </div>
        </div>
    </div>
        `

        productDivElm.innerHTML += htmlElm
        
    })

    addToCartFunc()
}


renderProducts()

// Generate product Id 
function generateProductId (e){
    return e.classList[0].split('-')[1]
}

// product add to arr and cart

let productCart = JSON.parse(localStorage.getItem('CART')) || []
updateCartElement()

function productAddition(id){
    

    if(productCart.some( item => item.id === Number(id))){
        
        alert('Product Already Added')
    }else{
        const matchProduct = products.find( product => product.id === Number(id))

        matchProduct.productUnit = 1
        productCart.push(matchProduct)
        
    }

    updateCartElement()

}

// add to cart function
function addToCartFunc(){
    const allAddToCartBtn = document.querySelectorAll('.add-to-cart');
    for(let i = 0; i < allAddToCartBtn.length; i++){
        allAddToCartBtn[i].addEventListener('click', e => {
            const id = generateProductId(e.target)
            productAddition(id)
        })
    }
}


// upadate cart 

function updateCartElement(){
    renderCartItems()
    renderSubTotals()
    removeItemFromList()
    itemSavedInLocalStorage()
}
// item saved in local storage
function itemSavedInLocalStorage(){

    localStorage.setItem('CART', JSON.stringify(productCart))
    
}

// remove item from arr
function removeItemFromList(){
    const cartItemImgElm = document.querySelectorAll('.cart-item-info img')
    for(let i = 0; i < cartItemImgElm.length; i++){
        cartItemImgElm[i].addEventListener('click', e => {
            const id = generateProductId(e.target)
            productCart = productCart.filter( product => product.id !== Number(id))   
            updateCartElement()
        })
    }
}

function renderCartItems(){
    cartItemsDivElm.innerHTML = ''
    productCart.forEach( product => {
        
        const htmlELm = `
        <div class="cart-item">
            <div class="item-info cart-item-info">
                <img src="${product.imgSrc}" alt="t-shirt 1" class="id-${product.id}">
                <h4>${product.name}</h4>
            </div>
            <div class="unit-price">
                <small>$</small>${product.price}
            </div>
            <div class="units">
                <div class="id-${product.id} btn minus">-</div>
                <div class="number">${product.productUnit}</div>

                <div class="id-${product.id} btn plus">+</div>           
            </div>
         </div>
    `
    cartItemsDivElm.innerHTML += htmlELm 

    
    })

    changeUnits()
    
}

function renderSubTotals(){
    let totalPrice = 0, 
    totalItems = 0

    productCart.map( elem => {
        totalPrice += elem.price * elem.productUnit
        totalItems += elem.productUnit
    })

    subTotalElm.innerHTML = `Subtotal (${totalItems} items): $${totalPrice.toFixed(2)}`
    cartTotalItemEm.innerHTML = `${totalItems}`
}


///change of units
function changeUnits(){
    let productUnit = document.querySelectorAll('.units')
   
    let g = 0
    let oldUnitId = 0

    
    
    for(let i = 0; i < productUnit.length; i++){
        productUnit[i].addEventListener('click', e => {
            const id = generateProductId(e.target)
            // console.log(id);
            
            productCart.map( elem => {
                let newProductUnit =  elem.productUnit;
                // console.log(odlProductUnit);
                
                if(elem.id === Number(id)){
                
                    if(e.target.classList[2] === 'minus' && newProductUnit > 1){
                        newProductUnit--
                    }

                    if(e.target.classList[2] === 'plus' && elem.instock > newProductUnit){
                        newProductUnit++
                    }

                
                }
                // console.log(g);
                elem.productUnit = newProductUnit

                

                return elem
            })
            
            updateCartElement()
        })
        
    }
}