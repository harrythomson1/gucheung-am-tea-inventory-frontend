type AddCustomerModalProps = {
  onClose: () => void
}

export function AddCustomerModal({ onClose }: AddCustomerModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80">
          <div>AddCustomerModal</div>
          <button onClick={() => onClose()}>Submit</button>
        </div>
      </div>
    </>
  )
}
