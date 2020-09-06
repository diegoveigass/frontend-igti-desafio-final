import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import './styles.css';
import ModalCreate from '../../components/ModalCreate';
import ModalEdit from '../../components/ModalEdit';

function Dashboard() {
  const [dates, setDates] = useState([]);
  const [details, setDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    async function loadData() {
      const response = await api.get('/all_dates');

      setDates(response.data);
    }
    loadData();
  }, []);

  const handlePeriod = async date => {
    const response = await api.get('/by_period', {
      params: {
        period: date,
      },
    });

    const responseFormatted = response.data.transactions.map(details => ({
      ...details,
      formattedValue: formatValue(details.value),
      descriptionToLowerCase: details.description.toLowerCase(),
      categoryToLowerCase: details.category.toLowerCase(),
    }));

    setDetails(responseFormatted);
  };

  useEffect(() => {
    const filteredArray = details.filter(detail => {
      return (
        detail.descriptionToLowerCase.includes(inputText.toLowerCase()) ||
        detail.categoryToLowerCase.includes(inputText.toLowerCase())
      );
    });
    setFilteredDetails([...filteredArray]);
  }, [details, inputText]);

  const calcRecipes = useMemo(() => {
    const { receita, despesa } = filteredDetails.reduce(
      (accumulator, transactions) => {
        switch (transactions.type) {
          case '+':
            accumulator.receita += transactions.value;
            break;
          case '-':
            accumulator.despesa += transactions.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        receita: 0,
        despesa: 0,
        total: 0,
      }
    );

    const total = receita - despesa;

    return { receita, despesa, total };
  }, [filteredDetails]);

  const receitaFormatted = formatValue(calcRecipes.receita);
  const despesaFormatted = formatValue(calcRecipes.despesa);
  const totalFormatted = formatValue(calcRecipes.total);

  const handleDelete = async id => {
    await api.delete(`/delete_transaction/${id}`);

    const newTransactions = filteredDetails.filter(detail => detail._id !== id);

    setFilteredDetails(newTransactions);
  };

  return (
    <>
      <div className='container center'>
        <h1>Controle de finanças</h1>

        <div className='container center'>
          <select
            className='browser-default'
            onChange={e => handlePeriod(e.target.value)}
          >
            <option value='0'>Selecione um ano e mes</option>
            {dates.map(date => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
        </div>
        <div className='input-button center container'>
          <ModalCreate />
          <input
            type='text'
            value={inputText}
            placeholder='Filtrar por descrição/categoria'
            onChange={e => setInputText(e.target.value)}
          />
        </div>
      </div>

      <div className='details container center'>
        <p>
          <strong>Lançamentos:</strong>{' '}
          {filteredDetails.length > 0 ? filteredDetails.length : 0}
        </p>
        <p>
          <strong>Receitas:</strong> {receitaFormatted}
        </p>
        <p>
          <strong>Despesas:</strong> {despesaFormatted}
        </p>
        <p>
          <strong>Saldo:</strong> {totalFormatted}
        </p>
      </div>

      <div style={{ padding: 12 }} className='container center'>
        {filteredDetails.length !== 0 ? (
          filteredDetails.map(detail => (
            <div
              key={detail._id}
              className={
                detail.type === '+'
                  ? 'card-details teal lighten-2'
                  : 'card-details red lighten-4'
              }
            >
              <span className='day'>{detail.day}</span>
              <div className='all'>
                <div className='category-description'>
                  <span className='category bold'>{detail.category}</span>
                  <span className='category'>{detail.description}</span>
                </div>

                <span className='value'>{detail.formattedValue}</span>
              </div>
              <div className='button-container'>
                <ModalEdit detail={detail} />
                <button
                  onClick={() => handleDelete(detail._id)}
                  className='waves-effect waves-light btn light red'
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        ) : (
          <h1>Nenhum lançamento encontrado</h1>
        )}
      </div>
    </>
  );
}

export default Dashboard;
