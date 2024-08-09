import React, { useState, useEffect } from 'react';
import { getPopups } from '../api/popups';
import { getDailySalesStatistics } from '../api/statistics';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/PopupStatisticsPage.css';
import dayjs from 'dayjs'; // 날짜 처리를 위해 dayjs를 사용합니다.

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function PopupStatisticsPage() {
  const [popups, setPopups] = useState([]);
  const [selectedPopup, setSelectedPopup] = useState('');
  const [salesData, setSalesData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopups = async () => {
      try {
        const data = await getPopups('APPROVED', 'all');
        setPopups(data.content || []);
        if (data.content && data.content.length > 0) {
          setSelectedPopup(data.content[0].popupId);
        }
      } catch (error) {
        setError('통계 자료를 조회할 팝업이 없습니다.');
      }
    };

    fetchPopups();
  }, []);

  useEffect(() => {
    if (selectedPopup) {
      const fetchSalesData = async () => {
        try {
            let data = await getDailySalesStatistics(selectedPopup);
          
            // 최근 30일간의 날짜를 생성
            const today = dayjs();
            const last30Days = Array.from({ length: 30 }, (_, i) =>
              today.subtract(i, 'day').format('YYYY-MM-DD')
            ).reverse();
          
            // 데이터의 날짜 형식을 맞춰 0으로 채워 넣기
            const salesDataMap = data.reduce((acc, entry) => {
              const date = dayjs(`${entry.year}-${String(entry.month).padStart(2, '0')}-${String(entry.day).padStart(2, '0')}`).format('YYYY-MM-DD');
              acc[date] = entry.totalSalesAmount;
              return acc;
            }, {});
          
            const filledData = last30Days.map(date => ({
              date,
              totalSalesAmount: salesDataMap[date] || 0,
            }));
          
            setSalesData(filledData);
          } catch (error) {
            setError('통계 자료를 불러오는데 실패했습니다.');
          }
          
      };

      fetchSalesData();
    }
  }, [selectedPopup]);

  const handlePopupChange = (e) => {
    setSelectedPopup(e.target.value);
  };

  const chartData = {
    labels: salesData.map((data) => data.date),
    datasets: [
      {
        label: '판매량',
        data: salesData.map((data) => data.totalSalesAmount),
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
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
          text: 'Date'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Sales Amount'
        },
        beginAtZero: true
      }
    },
  };

  return (
    <div className="container mt-5">
      <h3 className="mb-4 title-spacing">팝업 매출 통계</h3>
      <div className="dropdown-container mb-4">
        {popups.length === 0 ? (
          <div className="error-message">통계 자료를 조회할 팝업이 없습니다.</div>
        ) : (
          <>
            <select className="form-select custom-dropdown" value={selectedPopup} onChange={handlePopupChange}>
              {popups.map((popup) => (
                <option key={popup.popupId} value={popup.popupId}>
                  {popup.name}
                </option>
              ))}
            </select>
          </>
        )}
      </div>
      {error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="chart-container">
          <Line data={chartData} options={options} />
        </div>
      )}
    </div>
  );
}

export default PopupStatisticsPage;
