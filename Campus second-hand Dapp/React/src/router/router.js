import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';


import Register from '../pages/Register';
import Login from '../pages/Login';
import NotFoundPage from '../pages/NotFoundPage';
import BuyerHome from '../pages/BuyerHome';
import SellerHome from '../pages/SellerHome';
import BuyerProjectList from '../pages/BuyerProjectList';
import SellerProjectList from '../pages/SellerProjectList';
import BuyerProductInfo from '../pages/BuyerProductInfo';
import SellerProjectAdd from '../pages/SellerProjectAdd';
import GetBuyerHistoryList from '../pages/BuyHistorysList';
import GetBuyerCollectionList from '../pages/BuyerCollectionLists';
import GetBuyerReports from '../pages/BuyerReportList'


export default function MyRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/apib" element={<BuyerHome />}>
                    <Route path="buyerProjectList" element={<BuyerProjectList />} />  
                    <Route path="buyerProductInfo/:id" element={<BuyerProductInfo />} />
                    <Route path="buyerHistoryList" element={<GetBuyerHistoryList />} />
                    <Route path="buyerCollectionList" element={<GetBuyerCollectionList />} />
                    <Route path="buyerReportList" element={<GetBuyerReports />} />
                </Route>
                <Route path="/apis" element={<SellerHome />}>
                    <Route path="sellerProjectList" element={<SellerProjectList />} /> 
                    <Route path="sellerProjectAdd" element={<SellerProjectAdd />} />
                </Route>
                <Route path="*" element={<NotFoundPage />}/>
            </Routes>            
        </BrowserRouter>
)}


