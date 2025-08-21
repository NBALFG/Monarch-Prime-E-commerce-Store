# BR.F E-Commerce Store

A modern, responsive e-commerce website built with vanilla HTML, CSS, and JavaScript. Features a clean, Apple/IKEA-inspired design with full shopping cart functionality.

## 🛍️ Features

- **Responsive Design**: Mobile-first approach with clean, modern UI
- **Product Catalog**: Dynamic product grid with 12+ products
- **Product Pages**: Detailed product views with image galleries
- **Shopping Cart**: Full cart functionality with localStorage persistence
- **Nigerian Naira**: Localized currency support
- **Accessibility**: WCAG compliant with proper ARIA labels
- **Modern UI**: Soft shadows, rounded corners, smooth animations

## 🚀 Live Demo

Visit the live site: [Monarch Prime E-Commerce](https://NBALFG.github.io/Monarch-Prime-E-commerce-Store/)

*Your site will be live once GitHub Pages is enabled*

## 📁 Project Structure

```
E-Commerce/
├── index.html          # Homepage with product catalog
├── product.html        # Individual product page
├── cart.html          # Shopping cart page
├── styles.css         # Main stylesheet
├── product.css        # Product page styles
├── cart.css           # Cart page styles
├── script.js          # Main JavaScript functionality
├── product.js         # Product page interactions
├── cart.js            # Cart page functionality
├── cart-utils.js      # Shared cart utilities
├── products.js        # Product data
├── logo.png           # Brand logo
└── README.md          # This file
```

## 🛠️ Technologies Used

- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Flexbox, Grid, CSS Variables, Media Queries
- **JavaScript**: ES6+, localStorage, DOM manipulation
- **Google Fonts**: Inter and Manrope for modern typography

## 🎨 Design Features

- **Modern Aesthetic**: Clean, minimal design inspired by Apple and IKEA
- **Responsive Grid**: Product grid adapts from 1 to 4 columns
- **Touch-Friendly**: 44px minimum touch targets
- **Smooth Animations**: CSS transitions and hover effects
- **Color Scheme**: Neutral palette with accent colors

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 767px (1-2 columns)
- **Tablet**: 768px - 1023px (2-3 columns)
- **Desktop**: 1024px+ (3-4 columns)

## 🛒 Shopping Cart Features

- **Add to Cart**: From product pages with quantity selection
- **Cart Persistence**: Items saved in localStorage
- **Quantity Management**: Update quantities or remove items
- **Real-time Updates**: Cart count updates across all pages
- **Price Calculation**: Automatic total calculation

## 🎯 Product Features

- **Image Gallery**: Multiple product images with thumbnails
- **Variant Selection**: Color and size options with price adjustments
- **Product Details**: Comprehensive product information
- **Reviews Section**: Tabbed content (Details, Reviews, Discussion)

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NBALFG/Monarch-Prime-E-commerce-Store.git
   cd Monarch-Prime-E-commerce-Store
   ```

2. **Open in browser**:
   - Simply open `index.html` in your web browser
   - Or use a local server for development

3. **For development**:
   - Use a local server (e.g., Live Server in VS Code)
   - All features work without build tools

## 📝 Adding Products

To add new products, edit `products.js`:

```javascript
{
  id: 'unique-product-id',
  name: 'Product Name',
  price: 25000, // Price in Naira
  description: 'Product description here.',
  images: [
    'https://picsum.photos/seed/product1/1200/900',
    'https://picsum.photos/seed/product2/1200/900',
    'https://picsum.photos/seed/product3/1200/900',
  ],
}
```

## 🎨 Customization

### Colors
Edit CSS variables in `styles.css`:
```css
:root {
  --color-primary: #007AFF;
  --color-secondary: #5856D6;
  --color-accent: #FF3B30;
}
```

### Fonts
Change Google Fonts import in `styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Manrope:wght@400;500;600&display=swap');
```

## 🌐 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

Built with ❤️ for modern e-commerce experiences.
