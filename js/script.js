
document.addEventListener('alpine:init', () => {
    let retrievedItem;
    (async function getItemInfoFromJSON() {
        retrievedItem = await (await fetch('data.json')).json()
        getAndDisplayProduct()
    })()

    // CART
    Alpine.store('cart', {
        'items': [],
        formatPrices(itemId) {
            if (this.items.length) {
                let item = this.items[itemId]
                return `$${item.listPrice} x ${item.quantity} <strong class="text_heading">$${item.listPrice * item.quantity}</strong></span>`
            }
        },
        removeItem(itemId) {
            document.getElementById('item-' + this.items[itemId].id).remove();
            this.items.splice(this.items[itemId].id - 1, 1)
            document.querySelectorAll('.item_count').innerHTML = this.items.length
        },
        async addItem(quantity) {
            if (!this.items.find((item) => item.id == retrievedItem.id)) {
                retrievedItem.quantity = quantity
                this.items.push(retrievedItem)
            }
        }
    })

    // CAROUSEL
    const carouselData = {
        activeSlide: 0,
        translate: '',
        prev() { if (this.activeSlide > 0) this.activeSlide-- },
        next() { if (this.activeSlide < 3) this.activeSlide++ },
        slide() {
            return 'translateX(' + (-100 * this.activeSlide) + '%)';
        }
    }
    Alpine.data('carousel', () => ({
        ...carouselData,
        openLightBox: false,
    }))

    Alpine.data('carousel_lightBox', () => ({
        ...carouselData,
    }))

    // add product content on page from data.json
    function getAndDisplayProduct() {
        let html = `
            <p class="[ company_name ][ text_upper text_primary text_bold ]">
                <span class="visually_hidden">made by</span> 
                ${retrievedItem.companyName}
            </p>
            <h1 class="product_name text_heading">${retrievedItem.name}</h1>
            <p class="[ product_description ][ text_copy ]">${retrievedItem.description}</p>
            <div class="[ prices ][ d_flex align_center justify_between ][ text_bold ]">
                <p class="[ list_price ][ d_flex align_center ][ text_heading ]">
                    <span class="visually_hidden">currently selling for </span>
                    $${retrievedItem.listPrice}
                    <strong class="[ badge ][ bg_primary-light text_primary round_xs ]">
                        ${retrievedItem.discount} <span class="visually_hidden">discount</span></strong>
                </p>
                <s class="[ price ][ text_copy-light ]"><span class="visually_hidden">originally sold for </span>
                    $${retrievedItem.price}</s>
            </div>
            <div x-data="{itemQuantity: 1}"
                    class="actions" id="actions">
                <div class="[ quantity ][ d_flex align_center justify_between ][ bg_secondary round_sm w_100 ]">
                    <button @click="(itemQuantity > 1)? itemQuantity-- : itemQuantity" class="hover_opacity">
                        <img src="images/icon-minus.svg" alt="" aria-hidden="true">
                        <span class="visually_hidden">add item quantity by one</span>
                    </button>
                    <strong x-text="itemQuantity" class="text_heading">1</strong>
                    <input type="hidden" x-model="itemQuantity"  name="quantity">
                    <button @click="(itemQuantity < 10)? itemQuantity++ : itemQuantity" class="hover_opacity">
                        <img src="images/icon-plus.svg" alt="" aria-hidden="true">
                        <span class="visually_hidden">reduce item quantity by one</span>
                    </button>
                </div>
                <button @click="$store.cart.addItem(itemQuantity)"
                class="[ btn ][ d_flex align_center justify_center ][ bg_primary w_100 round_sm text_white fw_bold hover_opacity ]"
                        id="addItem_btn">
                    <img src="images/icon-cart-white.svg" alt="">
                    Add to cart
                </button>
            </div>
        `;
        document.querySelector('.content').insertAdjacentHTML('afterbegin', html)
    }
})


// test