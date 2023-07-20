const listOfProducts = [
    {id: 1, name: "100.000 monedas", priceUSD: 5},
    {id: 2, name: "200.000 monedas", priceUSD: 10},
    {id: 3, name: "500.000 monedas", priceUSD: 25}
];

const getCheckout = () => {
    return JSON.parse(localStorage.getItem("checkout")) || {
        products: [],
        total: 0
    }
}

const addToCheckout = ( productData, newQuantity ) => {
    let checkout = getCheckout();
    const prodIndex = checkout.products.findIndex(
        prod => prod.id === productData.id
    )
    let existingQuantity = 0

    if (prodIndex == -1) {
        checkout.products.push({ quantity: newQuantity, ...productData })
    }
    else {
        existingQuantity = checkout.products[prodIndex].quantity;
        checkout.products[prodIndex].quantity = newQuantity;
    }

    const diffQuantity = newQuantity - existingQuantity;

    checkout.total += productData.priceUSD * diffQuantity;
    localStorage.setItem("checkout", JSON.stringify(checkout))
}

const showProducts = (productsArray) => {
    const container = document.getElementById("tabla-precios")
    container.innerHTML = ""

    productsArray.forEach(({name, id, priceUSD})=>{
        const prodCard = document.createElement("div")
        prodCard.id = `prod${id}`
        prodCard.innerHTML = `
            <div class="precio-col">
                <div class="precio-col-header">
                    <h3>${name}</h3>
                </div>
                <div class="precio-col-features">
                    <p>${priceUSD} U$D</p>
                </div>
                
                <form class="product-add-form">
                    <label for="counter${id}">Cantidad</label>
                    <input type="number" placeholder="0" id="counter${id}">
                </form>

                <div class="precio-col-comprar">
                    <a id="buttonProd${id}">Comprar</a>
                </div>
            </div>
        `
        container.appendChild(prodCard)
        const btn = document.getElementById(`buttonProd${id}`)

        btn.addEventListener("click", (e) => {
            e.preventDefault()
            const newQuantity = Number(document.getElementById(`counter${id}`).value)
            if(newQuantity > 0){
                addToCheckout({name, id, priceUSD}, newQuantity);
                showCheckout();
            }
        })
    }) 
}


const initializeProductCardValues = () => {
    const checkout = getCheckout();

    checkout.products.forEach(({id, quantity}) => {
        const counter = document.getElementById(`counter${id}`)
        counter.value = quantity;
    })
}

const showCheckout = () => {
    const checkout = getCheckout();
    const checkoutContainer = document.getElementById("checkout")
    checkoutContainer.innerHTML=""

    if (!checkout.products.length) {
        checkoutContainer.innerHTML = `
            <p>Tu carrito está vacío.</p>
        `
    }
    else {
        checkoutContainer.innerHTML = `
            <h2>Carrito</h2>
            <p>Lista de Productos:</p>
            <ul id="checkoutList">

            </ul>
            <p>Total: ${checkout.total} U$D</p>

            <div class="button_checkout" onclick="endPurchase()">
                  <button>Finalizar Compra</button>
               </div>
        `
    }

    const checkoutList = document.getElementById("checkoutList")

    checkout.products.forEach(({ id, name, quantity, priceUSD }) => {
        const checkoutItem = document.createElement("li")
        checkoutItem.id = `checkoutItem${id}`
        checkoutItem.innerHTML = `
            <div class="checkout-item">
                <div>
                    <p>${name}</p>
                </div>
                <div>
                    <p>${quantity}</p>
                </div>
                <div>
                    <p>${quantity * priceUSD} U$D</p>
                </div>
            </div>
        `
        checkoutList.appendChild(checkoutItem)
    })
    
}


const endPurchase = async () => {
    localStorage.removeItem("checkout");
    const { isConfirmed } = await Swal.fire({
        title: '¿Está seguro de que quiere completar la orden?',
        icon: 'question',
        showCancelButton: true,
        showConfirmButton: true,
    })
    if (isConfirmed){
        await Swal.fire({
            title: 'La orden se ha completado con éxito',
            icon: 'success',
            showConfirmButton: true,
            timer: 1500
        })
        showCheckout();
    }
}

const init = () => {
    showProducts(listOfProducts);
    showCheckout();
    initializeProductCardValues();
}

init()