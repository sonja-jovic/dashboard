// App.js
import './App.css';
import React, { useState } from 'react';
import { Card, Container, Row, Col, Form, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';

import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';

import {
  items_en, items_fr,
  provincesAndTerritories_en, provincesAndTerritories_fr,
  months_en, months_fr,
  itemPrices
} from './itemPrices';

ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  ChartTooltip,
  Legend
);

function App() {
  const [isFrench, setIsFrench] = useState(false);

  const items1 = isFrench ? items_fr : items_en;
  const provinces1 = isFrench ? provincesAndTerritories_fr : provincesAndTerritories_en;
  const months1 = isFrench ? months_fr : months_en;

  const items2 = isFrench ? items_fr : items_en;
  const provinces2 = isFrench ? provincesAndTerritories_fr : provincesAndTerritories_en;
  const months2 = isFrench ? months_fr : months_en;

  const [selectedItem, setSelectedItem] = useState(items1[0]);
  const [selectedProvince, setSelectedProvince] = useState(provinces1[0]);

  const [selectedMonth, setSelectedMonth] = useState(months2[0]);
  const [selectedProvince2, setSelectedProvince2] = useState(provinces2[0]);

  React.useEffect(() => {
    const currentIndex = isFrench ? items_en.indexOf(selectedItem) : items_fr.indexOf(selectedItem);
    if (currentIndex >= 0) {
      setSelectedItem(isFrench ? items_fr[currentIndex] : items_en[currentIndex]);
    } else {
      setSelectedItem(items1[0]);
    }

    const currentProvinceIndex = isFrench
      ? provincesAndTerritories_en.indexOf(selectedProvince)
      : provincesAndTerritories_fr.indexOf(selectedProvince);
    if (currentProvinceIndex >= 0) {
      setSelectedProvince(isFrench ? provincesAndTerritories_fr[currentProvinceIndex] : provincesAndTerritories_en[currentProvinceIndex]);
    } else {
      setSelectedProvince(provinces1[0]);
    }
  }, [isFrench]);

  React.useEffect(() => {
    const currentMonthIndex = isFrench
      ? months_en.indexOf(selectedMonth)
      : months_fr.indexOf(selectedMonth);
    if (currentMonthIndex >= 0) {
      setSelectedMonth(isFrench ? months_fr[currentMonthIndex] : months_en[currentMonthIndex]);
    } else {
      setSelectedMonth(months2[0]);
    }

    const currentProvinceIndex = isFrench
      ? provincesAndTerritories_en.indexOf(selectedProvince2)
      : provincesAndTerritories_fr.indexOf(selectedProvince2);
    if (currentProvinceIndex >= 0) {
      setSelectedProvince2(isFrench ? provincesAndTerritories_fr[currentProvinceIndex] : provincesAndTerritories_en[currentProvinceIndex]);
    } else {
      setSelectedProvince2(provinces2[0]);
    }
  }, [isFrench]);

  const priceFormatter1 = new Intl.NumberFormat(isFrench ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  });

  const priceFormatter2 = new Intl.NumberFormat(isFrench ? 'fr-CA' : 'en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 2,
  });

  const chart1Data = {
    labels: months1,
    datasets: [
      {
        label: `${selectedItem} - ${selectedProvince}`,
        data: months1.map(month => {
          const langKey = isFrench ? 'fr' : 'en';
          const price = itemPrices[langKey][selectedItem]?.[selectedProvince]?.[month];
          return price ?? 0;
        }),
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const chart2Data = {
    labels: items2,
    datasets: [
      {
        label: `${isFrench ? 'Prix' : 'Price'} - ${selectedProvince2} - ${selectedMonth}`,
        data: items2.map(item => {
          const langKey = isFrench ? 'fr' : 'en';
          const price = itemPrices[langKey][item]?.[selectedProvince2]?.[selectedMonth];
          return price ?? 0;
        }),
        backgroundColor: 'rgba(40, 167, 69, 1)',
        borderColor: 'rgba(40, 167, 69, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { family: 'Quicksand', size: 12 },
        titleFont: { family: 'Quicksand', size: 14, weight: 'bold' },
        callbacks: {
          label: ctx => priceFormatter1.format(ctx.parsed.y ?? ctx.parsed)
        }
      },
    },
    scales: {
      x: {
        ticks: { font: { family: 'Quicksand', size: 12, weight: 420 }, color: '#333' },
      },
      y: {
        ticks: {
          font: { family: 'Quicksand', size: 12, weight: 420 }, color: '#333',
          callback: val => priceFormatter1.format(val),
        }
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        bodyFont: { family: 'Quicksand', size: 12 },
        titleFont: { family: 'Quicksand', size: 14, weight: 'bold' },
        callbacks: {
          label: ctx => priceFormatter2.format(ctx.parsed.y ?? ctx.parsed)
        }
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Quicksand', size: 12, weight: 420 }, color: '#333' },
      },
      y: {
        grid: { display: true },
        ticks: {
          font: { family: 'Quicksand', size: 12, weight: 420 }, color: '#333',
          callback: val => priceFormatter2.format(val),
        }
      }
    }
  };

  return (
    <Container fluid className="px-3 py-4">

    <div className="d-flex justify-content-between align-items-start mb-4 px-3">

      <div>
        <h2 className="dashboard-title mb-1">
          {isFrench
            ? 'Tendances des prix des produits ménagers au Canada'
            : 'Household Item Price Trends in Canada'}
        </h2>
        <p className="dashboard-description mb-0">
          {isFrench
            ? 'Explorez les prix de détail moyens des produits ménagers courants à travers le Canada de janvier à mai 2025.'
            : 'Explore average retail prices of common household items across Canada from January to May 2025.'}
        </p>
      </div>

      <span
        role="button"
        tabIndex={0}
        className="language-toggle"
        onClick={() => setIsFrench(!isFrench)}
      >
        {isFrench ? 'English' : 'Français'}
      </span>
    </div>
      <Row className="g-3">
        {/* LEFT CARD */}
        <Col xs={12} md={6}>
          <Card className="custom-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="graph-title mb-0">
                  {isFrench ? 'Tendances des prix au fil du temps' : 'Price Trends Over Time'}
                </Card.Title>

                <div className="d-flex align-items-center gap-3">
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-chart1">
                        {isFrench
                          ? "Voir le prix d'un article au fil du temps dans une province sélectionnée."
                          : 'View the price of an item over time in a selected province.'}
                      </Tooltip>
                    }
                  >
                    <span
                      role="button"
                      tabIndex={0}
                      className="about-text"
                      aria-label="About Price Trends Over Time"
                    >
                      {isFrench ? 'À propos' : 'About'}
                    </span>
                  </OverlayTrigger>

                </div>
              </div>

              <div className="d-flex gap-2 mb-3" style={{ maxWidth: '400px' }}>
                <Form.Select
                  size="sm"
                  className="custom-select"
                  value={selectedItem}
                  onChange={e => setSelectedItem(e.target.value)}
                >
                  {items_en.map((itemKey, i) => (
                    <option key={itemKey} value={isFrench ? items_fr[i] : itemKey}>
                      {isFrench ? items_fr[i] : itemKey}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  size="sm"
                  className="custom-select"
                  value={selectedProvince}
                  onChange={e => setSelectedProvince(e.target.value)}
                >
                  {provincesAndTerritories_en.map((provKey, i) => (
                    <option key={provKey} value={isFrench ? provincesAndTerritories_fr[i] : provKey}>
                      {isFrench ? provincesAndTerritories_fr[i] : provKey}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="chart-container">
                <Line data={chart1Data} options={chartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* RIGHT CARD */}
        <Col xs={12} md={6}>
          <Card className="custom-card h-100">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Card.Title className="graph-title mb-0">
                  {isFrench ? 'Comparaison des prix par produit' : 'Price Comparison by Product'}
                </Card.Title>

                <div className="d-flex align-items-center gap-3">
                  <OverlayTrigger
                    placement="left"
                    overlay={
                      <Tooltip id="tooltip-chart2">
                        {isFrench
                          ? 'Comparer les prix des articles dans une province et un mois sélectionnés.'
                          : 'Compare item prices in a selected province and month.'}
                      </Tooltip>
                    }
                  >
                    <span
                      role="button"
                      tabIndex={0}
                      className="about-text"
                      aria-label="About Price Comparison by Product"
                    >
                      {isFrench ? 'À propos' : 'About'}
                    </span>
                  </OverlayTrigger>
                </div>
              </div>

              <div className="d-flex gap-2 mb-3" style={{ maxWidth: '400px' }}>
                <Form.Select
                  size="sm"
                  className="custom-select"
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                >
                  {months_en.map((monthKey, i) => (
                    <option key={monthKey} value={isFrench ? months_fr[i] : monthKey}>
                      {isFrench ? months_fr[i] : monthKey}
                    </option>
                  ))}
                </Form.Select>
                <Form.Select
                  size="sm"
                  className="custom-select"
                  value={selectedProvince2}
                  onChange={e => setSelectedProvince2(e.target.value)}
                >
                  {provincesAndTerritories_en.map((provKey, i) => (
                    <option key={provKey} value={isFrench ? provincesAndTerritories_fr[i] : provKey}>
                      {isFrench ? provincesAndTerritories_fr[i] : provKey}
                    </option>
                  ))}
                </Form.Select>
              </div>

              <div className="chart-container">
                <Bar data={chart2Data} options={barChartOptions} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="mt-4 px-3 dataset-source">
      <small>
        {isFrench ? 'Source des données' : 'Data source'}:&nbsp;
        <a
          href="https://open.canada.ca/data/en/dataset/8015bcc6-401d-4927-a447-bb35d5dfcc91"
          target="_blank"
          rel="noopener noreferrer"
        >
          {isFrench
            ? 'Portail des données ouvertes du gouvernement du Canada'
            : 'Government of Canada Open Data Portal'}
        </a>
      </small>

      </div>
    </Container>
    
  );
}

export default App;
