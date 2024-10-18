import React from 'react';
import {
    Slide,
    ToastContainer,
} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from 'next-themes';

const CustomToastContainer = () => {
    const { theme } = useTheme();
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
            theme={theme === 'dark' ? 'dark' : 'light'}
            transition={Slide}
        />
    );
}

export default CustomToastContainer;