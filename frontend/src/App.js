import Footer from './components/Footer';
import Header from './components/Header';
import { Container, Row, Col } from 'react-bootstrap';
import HomeScreen from './screens/HomeScreen';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import ProductScreen from './screens/ProductScreen';
import CartScreen from './screens/CartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreeen';
import ShippingScreen from './screens/ShippingScreen';
import PaymentScreen from './screens/PaymentScreen';
import PlaceOrderScreen from './screens/PlaceOrderScreen';
import OrderScreen from './screens/OrderScreen';
import UserListScreen from './screens/UserListScreen';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import UserEditScreen from './screens/UserEditScreen';
import ProductListScreen from './screens/ProductListScreen';
import ProductEditScreen from './screens/ProductEditScreen';
import OrderListScreen from './screens/OrderListScreen';

function App() {
	return (
		<Router>
			<div className='App'>
				<Header />
				<main className='py-3'>
					<Container>
						<Route path='/product/:id' component={ProductScreen} />
						<Route path='/cart/:id?' component={CartScreen} />
						<ProtectedRoute path='/order/:id' component={OrderScreen} />
						<Route path='/login' component={LoginScreen} />
						<Route path='/register' component={RegisterScreen} />
						<ProtectedRoute path='/profile' component={ProfileScreen} />
						<ProtectedRoute path='/shipping' component={ShippingScreen} />
						<ProtectedRoute path='/payment' component={PaymentScreen} />
						<ProtectedRoute path='/placeorder' component={PlaceOrderScreen} />
						<AdminRoute path='/admin/userlist' component={UserListScreen} />
						<AdminRoute path='/admin/user/:id/edit' component={UserEditScreen} />
						<AdminRoute path='/admin/productlist/:pageNumber' component={ProductListScreen} exact />
						<AdminRoute path='/admin/productlist' component={ProductListScreen} exact />
						<AdminRoute path='/admin/product/:id/edit' component={ProductEditScreen} />
						<AdminRoute path='/admin/orderlist' component={OrderListScreen} />
						<Route path='/search/:keyword' component={HomeScreen} exact />
						<Route path='/search/:keyword/page/:pageNumber' component={HomeScreen} exact />
						<Route path='/page/:pageNumber' component={HomeScreen} exact />
						<Route path='/' exact component={HomeScreen} />
					</Container>
				</main>
				<Footer />
			</div>
		</Router>
	);
}

export default App;
