import React, { useState } from 'react';
import Modal from 'react-modal';
import api from '../../services/api';

import './styles.css';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

function ModalEdit({ detail }) {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
  }

  function closeModal() {
    setIsOpen(false);
  }

  async function handleSubmitForm(event) {
    event.preventDefault();
    const data = new FormData(event.target);

    const type = data.get('earning');
    const description = data.get('description');
    const category = data.get('category');
    const value = data.get('value');
    const date = data.get('date');

    const day = date.slice(-2);
    const month = date.slice(5, -3);
    const year = date.slice(0, 4);

    await api.put(`/${detail._id}`, {
      description,
      value,
      category,
      year,
      month,
      day,
      type,
    });

    closeModal();
  }

  return (
    <>
      <button
        className='button-add waves-effect waves-light btn light blue'
        onClick={openModal}
      >
        Editar
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Editar'
      >
        <div className='div-modal'>
          <h2>Inclusão de lançamento</h2>
          <button onClick={closeModal}>Sair</button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <div className='all-inputs'>
            <div className='despesa-receita'>
              <label>
                <input
                  name='earning'
                  type='radio'
                  value='-'
                  // checked={detail.type === '-' ? true : false}
                  defaultChecked={detail.type === '-' ? true : false}
                />
                <span>Despesa</span>
              </label>
              <label>
                <input
                  name='earning'
                  type='radio'
                  value='+'
                  // checked={detail.type === '+' ? true : false}
                  defaultChecked={detail.type === '+' ? true : false}
                />
                <span>Receita</span>
              </label>
            </div>
            <div className='input-field'>
              <input
                id='inputDescription'
                type='text'
                name='description'
                defaultValue={detail.description}
                required
              />
              <label htmlFor='inputDescription' className='active'>
                Descrição:
              </label>
            </div>
            <div className='input-field'>
              <input
                id='inputCategory'
                type='text'
                name='category'
                defaultValue={detail.category}
                required
              />
              <label htmlFor='inputCategory' className='active'>
                Categoria:
              </label>
            </div>
            <div style={{ display: 'flex', flex: 1, marginRight: 12 }}>
              <div className='input-group'>
                <label htmlFor='inputValue' className='active'>
                  Valor:
                </label>
                <input
                  id='inputValue'
                  name='value'
                  defaultValue={detail.value}
                  type='number'
                  step='.01'
                />
              </div>
              <input
                placeholder='Data'
                type='date'
                name='date'
                defaultValue={detail.yearMonthDay}
                className='browser-default'
                required
              />
            </div>
          </div>

          <button>Salvar</button>
        </form>
      </Modal>
    </>
  );
}

export default ModalEdit;
