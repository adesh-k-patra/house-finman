
import { AlertTriangle } from 'lucide-react'
import { Button, Modal } from '@/components/ui'

interface DeleteVendorModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    vendorName: string
}

export function DeleteVendorModal({ isOpen, onClose, onConfirm, vendorName }: DeleteVendorModalProps) {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Delete Vendor"
            description="This action cannot be undone."
            size="sm"
            footer={
                <>
                    <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    <Button variant="danger" onClick={onConfirm}>Delete Vendor</Button>
                </>
            }
        >
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-md flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="font-bold text-red-900 dark:text-red-300 text-sm">Warning</h4>
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                        Are you sure you want to delete <strong>{vendorName}</strong>? All associated invoices and purchase orders will be archived.
                    </p>
                </div>
            </div>
        </Modal>
    )
}
