import React, { useState, useEffect } from "react";
import { Pagination, Card, Input, Select, Button, Spin } from 'antd';
import { campusMarketContract } from '../contract/campusMarket';

const { Meta } = Card;
const { Option } = Select;

const BuyerProjectList_ZJP = () => {
    const [products_ZJP, setProducts_ZJP] = useState([]);
    const [loading_ZJP, setLoading_ZJP] = useState(false);
    const [currentPage_ZJP, setCurrentPage_ZJP] = useState(1);
    const [filteredProducts_ZJP, setFilteredProducts_ZJP] = useState([]);
    const [minPriceFilter_ZJP, setMinPriceFilter_ZJP] = useState("");
    const [maxPriceFilter_ZJP, setMaxPriceFilter_ZJP] = useState("");
    const [categoryFilter_ZJP, setCategoryFilter_ZJP] = useState("");

    useEffect(() => {
        async function fetchProducts_ZJP() {
            setLoading_ZJP(true);
            try {
                const gettotalProducts_ZJP = await campusMarketContract.methods.getProductCount().call();
                const totalProducts_ZJP = parseInt(gettotalProducts_ZJP);
                let productList_ZJP = [];
                for (let i = 0; i < totalProducts_ZJP; i++) {
                    try {
                        const product_ZJP = await campusMarketContract.methods.getProduct(i).call();
                        if (product_ZJP.active === false) continue;
                        productList_ZJP.push({
                            productId_ZJP: i + 1,
                            name_ZJP: product_ZJP.name,
                            description_ZJP: product_ZJP.description,
                            price_ZJP: parseInt(product_ZJP.price),
                            quantity_ZJP: parseInt(product_ZJP.quantity),
                            image_ZJP: product_ZJP.image,
                            timestamp_ZJP: parseInt(product_ZJP.timestamp),
                            seller_ZJP: product_ZJP.seller,
                            active_ZJP: product_ZJP.active,
                            category_ZJP: product_ZJP.category,
                        });
                    } catch (error_ZJP) {
                        console.error(`获取索引为 ${i} 的商品信息时出错:`, error_ZJP);
                    }
                }
                setProducts_ZJP(productList_ZJP);
                setFilteredProducts_ZJP(productList_ZJP);
                setLoading_ZJP(false);
            } catch (error_ZJP) {
                console.error("获取商品信息时出错:", error_ZJP);
                setLoading_ZJP(false);
            }
        }

        fetchProducts_ZJP();
    }, []);

    const handlePageChange_ZJP = (page_ZJP) => {
        setCurrentPage_ZJP(page_ZJP);
    };

    const productsPerPage_ZJP = 4;
    const displayedProducts_ZJP = filteredProducts_ZJP.slice((currentPage_ZJP - 1) * productsPerPage_ZJP, currentPage_ZJP * productsPerPage_ZJP);

    const handleFilter_ZJP = () => {
        let filtered_ZJP = products_ZJP;
        if (minPriceFilter_ZJP) {
            filtered_ZJP = filtered_ZJP.filter(product_ZJP => product_ZJP.price_ZJP >= parseInt(minPriceFilter_ZJP));
        }
        if (maxPriceFilter_ZJP) {
            filtered_ZJP = filtered_ZJP.filter(product_ZJP => product_ZJP.price_ZJP <= parseInt(maxPriceFilter_ZJP));
        }
        if (categoryFilter_ZJP) {
            filtered_ZJP = filtered_ZJP.filter(product_ZJP => product_ZJP.category_ZJP === categoryFilter_ZJP);
        }
        setFilteredProducts_ZJP(filtered_ZJP);
        setCurrentPage_ZJP(1);
    };

    const handleReset_ZJP = () => {
        setMinPriceFilter_ZJP("");
        setMaxPriceFilter_ZJP("");
        setCategoryFilter_ZJP("");
        setFilteredProducts_ZJP(products_ZJP);
        setCurrentPage_ZJP(1);
    };

    return (
        <Spin size='large' tip='加载中...' spinning={loading_ZJP}>
            <div>
                <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'left', gap: '16px' }}>
                    <Input
                        placeholder="输入价格下限"
                        value={minPriceFilter_ZJP}
                        onChange={e => setMinPriceFilter_ZJP(e.target.value)}
                        style={{ width: 200, height: '30px'}}
                    />
                    <Input
                        placeholder="输入价格上限"
                        value={maxPriceFilter_ZJP}
                        onChange={e => setMaxPriceFilter_ZJP(e.target.value)}
                        style={{ width: 200, height: '30px'}}
                    />
                    <Select
                        placeholder="选择类别"
                        value={categoryFilter_ZJP}
                        onChange={value => setCategoryFilter_ZJP(value)}
                        style={{ width: 200 }}
                    >
                        <Option value="学习用品">学习用品</Option>
                        <Option value="生活用品">生活用品</Option>
                        <Option value="电子产品">电子产品</Option>
                        <Option value="零食">零食</Option>
                    </Select>
                    <Button style={{ marginTop: '2px' }} type="primary" onClick={handleFilter_ZJP}>筛选</Button>
                    <Button style={{ marginTop: '2px' }} type="primary" onClick={handleReset_ZJP}>重置</Button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'left' }}>
                    {displayedProducts_ZJP.map((product_ZJP, index_ZJP) => (
                        <Card
                            key={index_ZJP}
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" style={{ width: '100%', height: '300px' }} src={"https://gateway.pinata.cloud/ipfs/" + product_ZJP.image_ZJP} />}
                        >
                            <Meta title={"商品名称：" + product_ZJP.name_ZJP} description={"商品价格：" + product_ZJP.price_ZJP + "EJK"} />
                        </Card>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '150px' }}>
                    <Pagination
                        current={currentPage_ZJP}
                        total={filteredProducts_ZJP.length}
                        pageSize={productsPerPage_ZJP}
                        onChange={handlePageChange_ZJP}
                    />
                </div>
            </div>
        </Spin>
    );
}

export default BuyerProjectList_ZJP;
