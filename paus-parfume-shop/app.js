Vue.createApp({
  data() {
    return {
      products: [
        { name: 'Classic Bloom', image: 'https://i.imgur.com/wJKEK41.jpeg', description: 'Soft floral fragrance', sizes: [{ label: '10ml', price: 399 }, { label: '30ml', price: 699 }], selectedSize: null, qty: 1, badge: 'Best Seller' },
        { name: 'Nocturne Blend', image: 'https://i.imgur.com/YSRnEY7.jpeg', description: 'Bold masculine scent', sizes: [{ label: '10ml', price: 449 }, { label: '30ml', price: 749 }], selectedSize: null, qty: 1, badge: 'New' },
        { name: 'Clear Breeze', image: 'https://i.imgur.com/S7zHphH.jpeg', description: 'Fresh unisex fragrance', sizes: [{ label: '10ml', price: 349 }, { label: '30ml', price: 599 }], selectedSize: null, qty: 1, badge: 'Limited Edition' }
      ],
      cart: [],
      showCart: false,
      showSuccess: false,
      toast: '',
      showToast: false,
      checkout: { name: '', email: '', address: '' },
      orderId: '',
      why: [
        { title: 'Premium Quality', desc: 'Crafted with carefully selected high-quality ingredients.' },
        { title: 'Affordable Pricing', desc: 'Luxury fragrances at competitive prices.' },
        { title: 'Fast Delivery', desc: 'Quick and reliable shipping worldwide.' },
        { title: 'Customer Support', desc: 'Friendly support dedicated to your satisfaction.' }
      ],
      reviews: [
        { name: 'Maria L.', rating: 5, comment: 'Long-lasting fragrance with an elegant floral touch.' },
        { name: 'John D.', rating: 5, comment: 'Perfect as a gift. Premium quality and great value.' },
        { name: 'Aisha K.', rating: 4, comment: 'Elegant scent and surprisingly affordable.' }
      ],
      saleTime: 300,
      timer: null
    };
  },
  computed: {
    cartTotal() { return this.cart.reduce((sum, item) => sum + item.price * item.qty, 0); },
    minutes() { return Math.floor(this.saleTime / 60).toString().padStart(2, '0'); },
    seconds() { return (this.saleTime % 60).toString().padStart(2, '0'); }
  },
  methods: {
    saveCart() { localStorage.setItem('pau_cart', JSON.stringify(this.cart)); },
    loadCart() { const saved = localStorage.getItem('pau_cart'); if (saved) this.cart = JSON.parse(saved); },
    showMessage(msg) { this.toast = msg; this.showToast = true; setTimeout(() => this.showToast = false, 2000); this.shakeCartBtn(); },
addToCart(p) {
      if (!p.selectedSize) return;
      this.cart.push({
        name: p.name,
        size: p.selectedSize.label,
        price: p.selectedSize.price,
        qty: p.qty
      });
      this.saveCart();
      this.showMessage('✅ Added to cart');
      p.qty = 1;
      p.selectedSize = null;
    },
    removeFromCart(i) {
      this.cart.splice(i, 1);
      this.saveCart();
    },
    incrementCartQty(item) {
      item.qty++;
      this.saveCart();
      this.animateQty(item);
    },
    decrementCartQty(item) {
      if (item.qty > 1) {
        item.qty--;
        this.saveCart();
        this.animateQty(item);
      }
    },
    animateQty(item) {
      this.$nextTick(() => {
        const el = [...document.querySelectorAll('.cart-qty strong')]
          .find(s => parseInt(s.textContent) === item.qty);
        if (el) {
          el.classList.add('animate');
          setTimeout(() => el.classList.remove('animate'), 200);
        }
      });
    },
    buyNow(p) {
      if (!p.selectedSize) return;
      this.cart = [{
        name: p.name,
        size: p.selectedSize.label,
        price: p.selectedSize.price,
        qty: p.qty
      }];
      this.saveCart();
      p.qty = 1;
      p.selectedSize = null;
      const checkoutEl = document.getElementById('checkout');
      checkoutEl.scrollIntoView({ behavior: 'smooth' });
      checkoutEl.style.transition = 'background 0.5s';
      checkoutEl.style.background = '#fff9c4';
      setTimeout(() => checkoutEl.style.background = '#EDE7F6', 1000);
    },
    placeOrder() {
      if (!this.cart.length) { alert('Your cart is empty.'); return; }
      this.orderId = 'PAU-' + Date.now();
      this.showSuccess = true;
      this.cart = [];
      localStorage.removeItem('pau_cart');
      this.checkout = { name: '', email: '', address: '' };
      this.launchConfetti();
    },
    scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); },
    handleScroll() {
      document.querySelectorAll('.fade-in').forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) el.classList.add('show');
      });
      const backTop = document.getElementById('back-to-top');
      backTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    },
    shakeCartBtn() {
      const btn = document.querySelector('.cart-btn');
      btn.classList.add('shake');
      setTimeout(() => btn.classList.remove('shake'), 300);
    },
    launchConfetti() {
      const canvas = document.getElementById('confetti-canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const confetti = [];
      for (let i = 0; i < 150; i++) {
        confetti.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 6 + 2,
          dx: (Math.random() - 0.5) * 4,
          dy: Math.random() * 3 + 2,
          color: `hsl(${Math.random() * 360},100%,50%)`
        });
      }
      let animation;
      function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confetti.forEach(c => {
          ctx.fillStyle = c.color;
          ctx.beginPath();
          ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
          ctx.fill();
          c.x += c.dx;
          c.y += c.dy;
          if (c.y > canvas.height) { c.y = 0; c.x = Math.random() * canvas.width; }
        });
        animation = requestAnimationFrame(draw);
      }
      draw();
      setTimeout(() => { cancelAnimationFrame(animation); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 3000);
    }
  },
  mounted() {
    this.loadCart();
    this.timer = setInterval(() => {
      if (this.saleTime > 0) this.saleTime--;
      else { clearInterval(this.timer); alert('The sale has ended.'); }
    }, 1000);
    window.addEventListener('scroll', this.handleScroll);
    this.handleScroll();
  }
}).mount('#app');
