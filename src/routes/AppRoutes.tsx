import { useRoutes } from 'react-router-dom';

import Home from '../pages/Home/';
import Response from '../pages/Response';
import Prepending from '../pages/Prepending';

const AppRoutes = () => {
    const routes = useRoutes([
        {
            path: '/',
            element: (
                <Home />
            ),
        },
        {
            path: '/response',
            element: (
                <Response />
            ),
        },
        {
            path: '/prepending',
            element: (
                <Prepending />
            ),
        }
    ]);

    return routes;

};

export default AppRoutes;