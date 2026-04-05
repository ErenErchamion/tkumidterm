import { createBrowserRouter } from 'react-router-dom';
import { StoreLayout } from '../components/layout/StoreLayout';
import { HomePage } from '../pages/HomePage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { ProductDetailsPage } from '../pages/ProductDetailsPage';

export const appRouter = createBrowserRouter([
  {
    path: '/',
    element: <StoreLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'product/:id',
        element: <ProductDetailsPage />,
      },
      {
        path: 'brand/:brandId',
        element: <HomePage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

