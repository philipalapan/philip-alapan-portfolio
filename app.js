const { createApp } = Vue;
createApp({
data() {
return {
darkMode: false,

projects: [
  {
    title: "Pau's Perfume Shop",
    image: "https://i.imgur.com/4kEZhFx.jpeg",
    desc: "Vue 3 e-commerce demo with cart & checkout.",
    features: ["Add to cart", "Buy now", "Responsive UI"],
    tech: "HTML • CSS • JavaScript • Vue 3",
    demo: "#",
    code: "#"
  },
  {
    title: "Job Application Tracker",
    image: "https://i.imgur.com/GGMW46b.jpeg",
    desc: "Track job applications with localStorage.",
    features: ["Add / Edit / Delete", "Persistent data"],
    tech: "HTML • CSS • JavaScript",
    demo: "#",
    code: "#"
  },
  {
    title: "Resume",
    image: "https://i.imgur.com/IZvhZEL.jpeg",
    desc: "Responsive online resume showcasing skills and experience.",
    features: ["Download Resume", "Responsive Layout"],
    tech: "HTML • CSS • JavaScript",
    demo: "#",
    code: "#"
  },
  {
    title: "Portfolio",
    image: "https://i.imgur.com/wR7yvo2.jpeg",
    desc: "Personal web developer portfolio with projects and skills.",
    features: ["Projects showcase", "Dark Mode", "Responsive Design"],
    tech: "Vue 3 • HTML • CSS • JavaScript",
    demo: "#",
    code: "#"
  }
],
     
      skills: ["HTML", "CSS", "JavaScript", "Vue 3", "Git"],

      contact: {

        name:'',

        email:'',

        message:''

      },

   /* ADD-ON: typing text */

      typingText: "Junior Web Developer",

      typingIndex: 0,

      typingFullText: "Junior Web Developer • Vue Developer • Frontend Developer"
       }
     },

 methods: {
toggleDark() {
  
  this.darkMode = !this.darkMode;
  
  document.body.classList.toggle("dark");
  },

scrollTo(id) {

document.getElementById(id)
.scrollIntoView({ behavior:'smooth' });
},

scrollToTop() {
window.scrollTo({
top:0,
behavior:'smooth'
});
 },

 submitContact() {
alert(`Thank you ${this.contact.name}!`);
this.contact = {
          name:'',
          
          email:'',
         
         message:''
       };
    
     },

/* ADD-ON: typing effect */

    typeEffect(){

      if(this.typingIndex < this.typingFullText.length){

        this.typingText += this.typingFullText.charAt(this.typingIndex);

        this.typingIndex++;

        setTimeout(this.typeEffect, 80);
      }
    }
 },

 mounted() {
 window.addEventListener('scroll', () => {
document.getElementById('back-to-top')
.style.display =
window.scrollY > 300
   ? 'block'
   : 'none';
   });

 /* ADD-ON: start typing */
    this.typingText="";
    this.typeEffect();
     }

}).mount('#app');
