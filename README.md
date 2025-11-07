# Go Shopping - Modern eCommerce Application

A modern, full-featured eCommerce application built with Next.js, TypeScript, Tailwind CSS, and Redux Toolkit. This project demonstrates real-world frontend development practices with a complete product management system.

## 🚀 Features

### Core Features
- **Product Listing Page** - Browse products with pagination, search, and filtering
- **Product Details Page** - View detailed product information with image gallery
- **Favorites System** - Save and manage favorite products using Redux
- **CRUD Operations** - Create, Read, Update, and Delete products
- **Search Functionality** - Real-time product search with URL parameter sync
- **Advanced Filtering** - Filter by category, price range, and rating
- **Sorting** - Sort products by title, price, rating, stock, or brand

### Bonus Features
- **Toast Notifications** - Beautiful toast notifications using Sonner
- **Loading States** - Skeleton loaders matching the UI design
- **Error Handling** - Comprehensive error states with retry options
- **Responsive Design** - Fully responsive layout for all screen sizes
- **Dark Mode** - Theme toggle with persistent storage
- **Authentication** - Mock authentication with login page and token refresh

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **API**: [DummyJSON](https://dummyjson.com/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

## 🏃 Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Home/Product listing page
│   ├── favorites/          # Favorites page
│   ├── login/              # Login page
│   └── product/            # Product pages
│       ├── [id]/           # Product details
│       └── [id]/edit/      # Edit product
├── components/             # React components
│   ├── ui/                 # Shadcn UI components
│   ├── Navigation.tsx      # Main navigation bar
│   ├── ProductCard.tsx     # Product card component
│   └── ProductCardSkeleton.tsx  # Loading skeleton
├── store/                  # Redux store
│   ├── slices/             # Redux slices
│   │   ├── authSlice.ts    # Authentication state
│   │   ├── favoritesSlice.ts # Favorites state
│   │   └── themeSlice.ts   # Theme state
│   └── store.ts            # Store configuration
├── lib/                     # Utilities and API
│   ├── api.ts              # API client and endpoints
│   └── utils.ts            # Utility functions
└── hooks/                   # Custom React hooks
    └── useTokenRefresh.ts   # Token refresh hook
```

## 🔌 API Endpoints

The application uses the [DummyJSON API](https://dummyjson.com/docs/products):

- `GET /products` - Get all products
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Get product by ID
- `GET /products/categories` - Get all categories
- `GET /products/category/:category` - Get products by category
- `POST /products/add` - Create new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

## 🎨 Features in Detail

### Product Listing
- Infinite scroll pagination
- Real-time search with URL sync
- Advanced filtering (category, price, rating)
- Multi-field sorting
- Responsive grid layout

### Product Management
- Create products with validation
- Edit existing products
- Delete products with confirmation dialog
- Image gallery with thumbnail navigation

### User Experience
- Persistent favorites using Redux
- Dark mode with localStorage persistence
- Toast notifications for all actions
- Loading skeletons matching UI design
- Error states with retry functionality

### Authentication
- Login page with form validation
- JWT token management
- Automatic token refresh
- Persistent sessions

## 🔐 Demo Credentials

For testing the login functionality:
- **Username**: `emilys`
- **Password**: `emilyspass`

## 📱 Responsive Design

The application is fully responsive with breakpoints:
- Mobile: Default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `md:` (768px+)
- Large Desktop: `lg:` (1024px+)
- XL Desktop: `xl:` (1280px+)
- 2XL Desktop: `2xl:` (1536px+)

## 🎯 Key Features Implementation

- **State Management**: Redux Toolkit for global state (favorites, theme, auth)
- **URL State**: Search parameters for filters and search query
- **Optimistic Updates**: Immediate UI feedback with Redux
- **Error Boundaries**: Comprehensive error handling
- **Performance**: Code splitting, lazy loading, and optimized images

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🚢 Deployment

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📄 License

This project is private and for educational purposes.

## 👨‍💻 Development

Built with modern React patterns and best practices:
- Server and Client Components
- TypeScript for type safety
- Tailwind CSS for styling
- Redux Toolkit for state management
- Axios for API calls
- Next.js App Router for routing

---

Made with ❤️ using Next.js and modern web technologies.
