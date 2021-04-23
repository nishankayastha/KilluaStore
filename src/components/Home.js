import React, { Fragment, useEffect } from 'react'

import MetaData from './layout/MetaData'
import product from './product/product'

import { useDispatch, useSelector } from 'react-redux'
import { getProducts } from '../actions/productActions'

const Home = () => {

    const  dispatch = useDispatch();

    const { loading, products, error, productsCount } = useSelector(state => state.products)

    useEffect(() => {
        effect
            dispatch( getProducts());
    }, [dispatch])

  return (
        <Fragment>
            {loading ? <h1>Loading...</h1> : (
                <Fragment>
                    <MetaData title={'Purchase to your heart content'} />

                    
                    <h1 id="products_heading">Latest Products</h1>

                    <section id="products" className="container mt-5">
                        <div className="row">
                            {products && products.map(product => (

                                <Product key={product_id} product={product} />
        ))}
        

                        </div>
                    </section>
                <Fragment/>

            )}

         </Fragment>
    )
}

export default Home