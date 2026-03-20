type AddCustomerModalProps = {
  onClose: () => void
}

export function AddCustomerModal({ onClose }: AddCustomerModalProps) {
  return (
    <>
      <div>AddCustomerModal</div>
      <button onClick={() => onClose()}>Submit</button>
    </>
  )
}
