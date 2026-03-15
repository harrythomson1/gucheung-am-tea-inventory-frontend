import { useEffect, useState } from 'react'
import { getTeas } from '../api/tea'
import type { SubmitHandler } from 'react-hook-form'
import type { AddTransactionData } from '../types/transaction'
import { postTransaction } from '../api/transaction'
import { useNavigate } from 'react-router-dom'

type AddStockInputs = Omit<AddTransactionData, 'transaction_type'>

export default function AddStockForm() {
  const navigate = useNavigate()
  const [teas, setTeas] = useState([])
  useEffect(() => {
    getTeas().then((response) => setTeas(response))
  }, [])

  const onSubmit: SubmitHandler<AddStockInputs> = async (data) => {
    try {
      await postTransaction({ ...data, transaction_type: 'harvest' })
      navigate('/')
    } catch (error) {
      console.error(error)
    }
  }
  return <div>Add stock form</div>
}
