import { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import convertRupiah from "rupiah-format";

import Navbar from "../components/Navbar";

import dataProduct from "../fakeData/product";

// Import useQuery and useMutation here ...
import { useQuery, useMutation } from "react-query";

// Get API config here ...
import { API } from "../config/api";

export default function DetailProduct() {
  let history = useHistory();
  let { id } = useParams();
  let api = API();

  // Create process for fetching product by id data from database with useQuery here ...
  const { data: product, refetch } = useQuery("productCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.token,
      },
    };

    const response = await api.get("/product/" + id, config);

    return response.data;
  });

  // Create function for handle buying process with useMutation here ...
  const handleBuy = useMutation(async () => {
    try {
      const data = {
        idProduct: product.id,
        idSeller: product.user.id,
        price: product.price,
      };

      const body = JSON.stringify(data);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.token,
        },
        body,
      };

      await api.post("/transaction", config);
      history.push("/profile");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div>
      <Navbar />
      <Container className="py-5">
        <Row>
          <Col md="2"></Col>
          <Col md="3">
            <img src={product?.image} className="img-fluid" alt={product?.name} />
          </Col>
          <Col md="5">
            <div className="text-header-product-detail">{product?.name}</div>
            <div className="text-content-product-detail">Stock : {product?.qty}</div>
            <p className="text-content-product-detail mt-4">{product?.desc}</p>
            <div className="text-price-product-detail text-end mt-4">{convertRupiah.convert(product?.price)}</div>
            <div className="d-grid gap-2 mt-5">
              <button onClick={() => handleBuy.mutate()} className="btn btn-buy">
                Buy
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
