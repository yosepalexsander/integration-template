import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useHistory } from "react-router";

import NavbarAdmin from "../components/NavbarAdmin";

import dataCategory from "../fakeData/category";

// Import useQuery
import { useQuery, useMutation } from "react-query";

// API config
import { API } from "../config/api";

export default function UpdateCategoryAdmin() {
  const title = "Category admin";
  document.title = "DumbMerch | " + title;

  let history = useHistory();
  let api = API();
  const { id } = useParams();

  // Create variabel for store data with useState here ...
  const [category, setCategory] = useState({});

  // Create process for handle fetching category data by id from database with useQuery here ...
  const { refetch } = useQuery("categoryCache", async () => {
    const response = await api.get("/category/" + id);
    setCategory(response.data);
  });
  const handleChange = (e) => {
    setCategory({
      ...category,
      name: e.target.value,
    });
  };

  // Create function for handle insert new product data with useMutation here ...
  const handleSubmit = useMutation(async (e) => {
    e.preventDefault();
    try {
      const body = JSON.stringify(category);
      const config = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      };

      const response = await api.patch("/category/" + id, config);
      history.push("/category-admin");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <>
      <NavbarAdmin title={title} />
      <Container className="py-5">
        <Row>
          <Col xs="12">
            <div className="text-header-category mb-4">Edit Category</div>
          </Col>
          <Col xs="12">
            <form onSubmit={(e) => handleSubmit.mutate(e)}>
              <input
                onChange={handleChange}
                value={category.name}
                placeholder="category"
                className="input-edit-category mt-4"
              />
              <div className="d-grid gap-2 mt-4">
                <Button type="submit" variant="success" size="md">
                  Save
                </Button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </>
  );
}
