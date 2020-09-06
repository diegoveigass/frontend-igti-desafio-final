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

function ModalCreate() {
  const [modalIsOpen, setIsOpen] = useState(false);
  // const [type, setType] = useState('');
  // const [description, setDescription] = useState('');
  // const [category, setCategory] = useState('');
  // const [value, setValue] = useState(0);
  // const [date, setDate] = useState('');

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

    await api.post('/', {
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
    <div>
      <button
        className='button-add waves-effect waves-light btn light blue'
        onClick={openModal}
      >
        Novo lançamento
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel='Adicionar lançamento'
      >
        <div className='div-modal'>
          <h2>Inclusão de lançamento</h2>
          <button onClick={closeModal}>Sair</button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <div className='all-inputs'>
            <div className='despesa-receita'>
              <label>
                <input name='earning' type='radio' value='-' />
                <span>Despesa</span>
              </label>
              <label>
                <input name='earning' type='radio' value='+' />
                <span>Receita</span>
              </label>
            </div>
            <div className='input-field'>
              <input
                id='inputDescription'
                type='text'
                name='description'
                required
              />
              <label htmlFor='inputDescription' className='active'>
                Descrição:
              </label>
            </div>
            <div className='input-field'>
              <input id='inputCategory' type='text' name='category' required />
              <label htmlFor='inputCategory' className='active'>
                Categoria:
              </label>
            </div>
            <div style={{ display: 'flex', flex: 1, marginRight: 12 }}>
              <div className='input-group'>
                <label htmlFor='inputValue' className='active'>
                  Valor:
                </label>
                <input id='inputValue' name='value' type='number' step='.01' />
              </div>
              <input
                placeholder='Data'
                type='date'
                name='date'
                className='browser-default'
                required
              />
            </div>
          </div>

          <button>Salvar</button>
        </form>
      </Modal>
    </div>
  );
}

export default ModalCreate;
