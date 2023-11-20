 import React, { useState, useEffect } from 'react';
 import axios from 'axios';
 import Grid from '@mui/system/Unstable_Grid';
 import DeleteIcon from '@mui/icons-material/Delete';
 import EditIcon from '@mui/icons-material/Edit';
 import AddIcon from '@mui/icons-material/Add';
 import UpdateIcon from '@mui/icons-material/Update';
 import { styled } from '@mui/system';
 import './App.css';

import {
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from '@mui/material';

const initialFormData = {
  name: '',
  description: '',
  price: '',
  discount: '',
};

const App = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [products, setProducts] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
        axios.get('http://localhost:8000/api/products')
          .then(response => {
            setProducts(response.data);
          });
      }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAddProduct = () => {
    if (
      !formData.name ||
      !formData.description ||
      isNaN(formData.price) || // Ensure numeric value
      isNaN(formData.discount) || // Ensure numeric value
      formData.price <= 0 ||
      formData.discount < 0 ||
      formData.discount > 100
    ) {
      alert('Please fill in all required fields and ensure valid values for Price and Discount.');
      return;
    }

    // Simulate generating ID from the backend (replace with actual logic)

    axios.post('http://localhost:8000/api/products', formData)
      .then(response => {
        setProducts([...products, response.data]);
        setFormData(initialFormData);
      });
  };

  const handleStartEditProduct = (productId) => {
    setEditProductId(productId);
    setFormData(products.find((product) => product.id === productId));
  };

  const handleUpdateProduct = () => {
    if (
      !formData.name ||
      !formData.description ||
      isNaN(formData.price) || // Ensure numeric value
      isNaN(formData.discount) || // Ensure numeric value
      formData.price <= 0 ||
      formData.discount < 0 ||
      formData.discount > 100
    ) {
      alert('Please fill in all required fields and ensure valid values for Price and Discount.');
      return;
    }
    
    axios.put(`http://localhost:8000/api/products/${editProductId}`, formData)
        .then(response => {
            const updatedProducts = products.map(p => (p.id === editProductId ? response.data : p));
            setProducts(updatedProducts);
        });
    const updatedProducts = products.map((product) =>
      product.id === editProductId ? formData : product
    );
    setProducts(updatedProducts);
    setFormData(initialFormData);
    setEditProductId(null);
   
  };

  const handleDeleteProduct = (productId) => {

    axios.delete(`http://localhost:8000/api/products/${productId}`)
      .then(() => {
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts);
      });
    setEditProductId(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const calculateFinalPrice = (price, discount) => {
    const discountAmount = (price * discount) / 100;
    return price - discountAmount;
  };

  const GradientBackground = styled('div')({
    // background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    background: 'linear-gradient(4deg, #4f6ace 30%, #8a6af5 90%)',
    // backgroundColor: 'black',
    color: 'white',
    padding: '20px',
  });

  return (
    
    <Container>
      <Typography variant="h4" align="center" gutterBottom>
        Product Inventory
      </Typography>

      {/* Add or Edit Product Form */}
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {editProductId ? 'Edit Product' : 'Add Product'}
        </Typography>
       
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              size='small'
              required
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Price"
              fullWidth
              margin="normal"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              size='small'
              required
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Discount"
              fullWidth
              margin="normal"
              name="discount"
              type="number"
              value={formData.discount}
              onChange={handleInputChange}
              size='small'
              required
              inputProps={{ min: 0, max: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              fullWidth
              margin="normal"
              name="description"
              multiline
              rows={2}
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </Grid>
        </Grid>
        {editProductId ? (
          <Button variant="contained" color="primary" endIcon={<UpdateIcon />} onClick={handleUpdateProduct}>
            Update Product
          </Button>
        ) : (
         
          <Button  variant="contained" endIcon={<AddIcon />} onClick={handleAddProduct} >Add Product</Button>
        )}
      </Paper>

      {/* Product List */}
      <Typography variant="h5" gutterBottom>
        Product List
      </Typography>
      <TableContainer component={Paper} style={{borderBottomLeftRadius:0,borderBottomRightRadius:0}}>
        <Table size="small" >
          <TableHead>
            <TableRow hover>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Final Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => (
              <TableRow hover key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.discount}</TableCell>
                <TableCell>{calculateFinalPrice(product.price, product.discount)}</TableCell>
                <TableCell>
                <EditIcon
                    style={{ cursor: 'pointer'}}
                    onClick={() => handleStartEditProduct(product.id)}
                    color='primary'
                  />
                  <DeleteIcon
                    style={{ cursor: 'pointer'}}
                    color='secondary'
                    onClick={() => handleDeleteProduct(product.id)}
                  />
                  
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
      style={{backgroundColor: 'white',borderBottomLeftRadius:4,borderBottomRightRadius:4}}
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={products.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Container>
    
  );
};

export default App;
