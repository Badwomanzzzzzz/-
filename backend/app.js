const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const basicInfoRoutes = require('./routes/basicInfo');
const ordersRoutes = require('./routes/orders');
const bookSelectionRoutes = require('./routes/bookSelection');
const purchasingRoutes = require('./routes/purchasing');
const inventoryRoutes = require('./routes/inventory');
const distributionRoutes = require('./routes/distribution');
const feeRoutes = require('./routes/fee');
const usedBookRoutes = require('./routes/usedBook');
const reportsRoutes = require('./routes/reports');
const systemRoutes = require('./routes/system');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/basic-info', basicInfoRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/book-selection', bookSelectionRoutes);
app.use('/api/purchasing', purchasingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/distribution', distributionRoutes);
app.use('/api/fee', feeRoutes);
app.use('/api/used-book', usedBookRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/system', systemRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`);
});