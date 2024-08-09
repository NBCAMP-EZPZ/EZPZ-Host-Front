import React, { useState, useEffect } from 'react';
import { getItems } from '../api/items';
import { getMonthlySalesStatistics } from '../api/statistics';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/ItemStatisticsPage.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

function ItemStatisticsPage() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [displayedData, setDisplayedData] = useState([]);
  const [error, setError] = useState(null);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems();
        setItems(data.content || []);
        if (data.content && data.content.length > 0) {
          setSelectedItem(data.content[0].itemId);
        }
      } catch (error) {
        setError('통계 자료를 조회할 상품이 없습니다.');
      }
    };

    fetchItems();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      const fetchSalesData = async () => {
        try {
          const data = await getMonthlySalesStatistics(selectedItem);
          const reversedData = data.reverse(); // 최신월이 오른쪽에 오도록 데이터 순서 뒤집기
          setSalesData(reversedData);

          if (reversedData.length > 0) {
            let uniqueYears = [...new Set(reversedData.map(item => item.year))];
            uniqueYears.sort((a, b) => b - a); // 연도를 내림차순으로 정렬
            setYears(uniqueYears);
            setSelectedYear(uniqueYears[0]); // 가장 최근 연도를 기본값으로 설정
          } else {
            setYears([]);
            setSelectedYear(''); // 선택된 연도 초기화
          }
        } catch (error) {
          setError('통계 자료를 불러오는데 실패했습니다.');
        }
      };

      fetchSalesData();
    }
  }, [selectedItem]);

  useEffect(() => {
    if (selectedYear) {
      const filteredData = salesData.filter(data => data.year === parseInt(selectedYear));
      setDisplayedData(filteredData);
    }
  }, [selectedYear, salesData]);

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const countChartData = {
    labels: displayedData.map((data) => `${data.year}-${data.month}`),
    datasets: [
      {
        label: '판매량',
        data: displayedData.map((data) => data.totalSalesCount),
        borderColor: 'rgba(153,102,255,1)',
        backgroundColor: 'rgba(153,102,255,0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales Count'
        },
        beginAtZero: true
      }
    },
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 title-spacing">상품별 통계 조회</h3>
      <div className="dropdown-container mb-4">
        {items.length === 0 ? (
          <div className="error-message">통계 자료를 조회할 상품이 없습니다.</div>
        ) : (
          <>
            <select className="form-select custom-dropdown" value={selectedItem} onChange={handleItemChange}>
              {items.map((item) => (
                <option key={item.itemId} value={item.itemId}>
                  {item.name}
                </option>
              ))}
            </select>
            {years.length > 0 && (
              <select className="form-select custom-dropdown" value={selectedYear} onChange={handleYearChange}>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            )}
          </>
        )}
      </div>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
          {displayedData.length === 0 ? (
            <div className="error-message">통계 자료가 존재하지 않습니다.</div>
          ) : (
            <div className="chart-container">
              <Line data={countChartData} options={options} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ItemStatisticsPage;
