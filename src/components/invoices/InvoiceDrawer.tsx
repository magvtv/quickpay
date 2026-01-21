'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, EllipsisVerticalIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useAuthStore } from '@/stores/authStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { invoiceFormSchema, calculateInvoiceTotals, generateInvoiceNumber } from '@/lib/validations/invoiceSchema';
import InvoicePreviewModal from './InvoicePreviewModal';

export default function InvoiceDrawer() {
  const { isDrawerOpen, closeDrawer, createInvoice } = useInvoiceStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: {
      invoice_number: generateInvoiceNumber(),
      status: 'draft',
      issue_date: new Date(),
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      items: [{ description: '', quantity: 1, unit_price: 0, amount: 0 }],
      tax_rate: 0,
      is_recurring: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Watch items to calculate totals
  const items = watch('items');
  const taxRate = watch('tax_rate');

  const { subtotal, tax_amount, total } = calculateInvoiceTotals(
    items.map((item) => ({
      ...item,
      amount: item.quantity * item.unit_price,
    })),
    taxRate
  );

  const onSubmit = async (data: z.infer<typeof invoiceFormSchema>) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items: _items, ...invoiceData } = data;
      await createInvoice({
        ...invoiceData,
        user_id: user.id,
        invoice_number: invoiceData.invoice_number || generateInvoiceNumber(),
        subtotal,
        tax_amount,
        total,
        issue_date: invoiceData.issue_date.toISOString(),
        due_date: invoiceData.due_date.toISOString(),
      });
      closeDrawer();
    } catch (error) {
      console.error('Error creating invoice:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Transition appear show={isDrawerOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeDrawer}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Drawer */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex h-full flex-col bg-white shadow-2xl"
                  >
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-200">
                      {/* Top Row - Title and Close Button */}
                      <div className="flex items-center justify-between mb-4">
                        <Dialog.Title className="text-base font-semibold text-gray-900">
                          Create new invoice
                        </Dialog.Title>
                        <button
                          type="button"
                          onClick={closeDrawer}
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Bottom Row - Invoice Number and Copy Link */}
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-gray-900">
                          {watch('invoice_number')}
                        </h2>
                        <button
                          type="button"
                          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors uppercase tracking-wider"
                        >
                          <Square2StackIcon className="w-4 h-4" />
                          COPY PAYMENT LINK
                        </button>
                      </div>
                    </div>

                    {/* Form Content */}
                    <div className="flex-1 overflow-y-auto px-8 py-6 scrollbar-thin">
                      <div className="space-y-6">
                        {/* Recipient Email */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Recipient Email
                          </label>
                          <select
                            {...register('client_id')}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                          >
                            <option value="">Select a client</option>
                            <option value="1">Alex Parkinson (alex@email.com)</option>
                            <option value="2">Thomas Lee (thomas@email.com)</option>
                          </select>
                          {errors.client_id && (
                            <p className="mt-1 text-sm text-red-600">{errors.client_id.message}</p>
                          )}
                        </div>

                        {/* Project Description */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project / Description
                          </label>
                          <input
                            {...register('notes')}
                            placeholder="Legal Consulting"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                          />
                          {errors.notes && (
                            <p className="mt-1 text-sm text-red-600">{errors.notes.message}</p>
                          )}
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Issued on
                            </label>
                            <input
                              type="date"
                              {...register('issue_date')}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            />
                            {errors.issue_date && (
                              <p className="mt-1 text-sm text-red-600">{errors.issue_date.message}</p>
                            )}
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Due on
                            </label>
                            <input
                              type="date"
                              {...register('due_date')}
                              className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm bg-white"
                            />
                            {errors.due_date && (
                              <p className="mt-1 text-sm text-red-600">{errors.due_date.message}</p>
                            )}
                          </div>
                        </div>

                        {/* Recurring Checkbox */}
                        <div className="flex items-center gap-2.5">
                          <input
                            type="checkbox"
                            {...register('is_recurring')}
                            id="recurring"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                          />
                          <label htmlFor="recurring" className="text-sm text-gray-700 cursor-pointer">
                            This is a recurring invoice (monthly)
                          </label>
                        </div>

                        {/* Line Items */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Item
                          </label>
                          {/* Column Headers */}
                          <div className="grid grid-cols-12 gap-3 px-4 mb-2">
                            <div className="col-span-5 text-xs font-medium text-gray-500 uppercase">
                              Item
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                              Qty
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                              Price
                            </div>
                            <div className="col-span-2 text-xs font-medium text-gray-500 uppercase">
                              Total
                            </div>
                            <div className="col-span-1"></div>
                          </div>
                          <div className="space-y-3">
                            {fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="grid grid-cols-12 gap-3 items-center px-4 py-2"
                              >
                                {/* Description */}
                                <div className="col-span-5">
                                  <input
                                    {...register(`items.${index}.description`)}
                                    placeholder="Item description"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  />
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    placeholder="Qty"
                                    min="1"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  />
                                </div>

                                {/* Price */}
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    {...register(`items.${index}.unit_price`, { valueAsNumber: true })}
                                    placeholder="Price"
                                    step="0.01"
                                    min="0"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                                  />
                                </div>

                                {/* Total */}
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={(items[index].quantity * items[index].unit_price).toFixed(0)}
                                    disabled
                                    className="w-full px-3 py-2 text-sm bg-white border border-gray-200 rounded-md text-gray-900 font-medium"
                                  />
                                </div>

                                {/* Menu Button */}
                                <div className="col-span-1 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded transition-colors"
                                  >
                                    <EllipsisVerticalIcon className="w-5 h-5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Item Button */}
                          <button
                            type="button"
                            onClick={() => append({ description: '', quantity: 1, unit_price: 0, amount: 0 })}
                            className="mt-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                          >
                            <PlusIcon className="w-4 h-4" />
                            ADD ITEM
                          </button>

                          {/* Inline Total Display */}
                          <div className="grid grid-cols-12 gap-3 px-4 mt-4 pt-3 border-t border-gray-200">
                            <div className="col-span-9"></div>
                            <div className="col-span-2 text-right">
                              <span className="text-sm font-medium text-gray-900">Total</span>
                            </div>
                            <div className="col-span-1 text-right pr-8">
                              <span className="text-lg font-bold text-gray-900">${total.toFixed(0)}</span>
                            </div>
                          </div>
                        </div>

                        {/* Additional Notes */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Additional Notes
                          </label>
                          <textarea
                            {...register('notes')}
                            rows={3}
                            placeholder="Some additional notes for the client"
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between px-8 py-5 bg-white border-t border-gray-200">
                      <button
                        type="button"
                        onClick={() => setIsPreviewOpen(true)}
                        className="text-sm font-semibold text-blue-600 hover:text-blue-700 uppercase tracking-wide transition-colors"
                      >
                        PREVIEW
                      </button>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setValue('status', 'draft');
                            handleSubmit(onSubmit)();
                          }}
                          className="px-6 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-md transition-colors uppercase tracking-wide"
                        >
                          SAVE AS DRAFT
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-8 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors uppercase tracking-wide disabled:opacity-50"
                        >
                          {isSubmitting ? 'SENDING...' : 'SEND'}
                        </button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>

      {/* Invoice Preview Modal */}
      <InvoicePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        previewData={{
          invoice_number: watch('invoice_number') || generateInvoiceNumber(),
          client_name: 'Alex Parkinson', // TODO: Get from client selection
          client_email: watch('client_id') ? 'alex@email.com' : undefined,
          issue_date: (() => {
            const date = watch('issue_date');
            return date instanceof Date ? date : new Date();
          })(),
          due_date: (() => {
            const date = watch('due_date');
            return date instanceof Date ? date : new Date();
          })(),
          items: items.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            unit_price: item.unit_price,
            amount: item.quantity * item.unit_price,
          })),
          subtotal,
          tax_rate: taxRate || 0,
          tax_amount,
          total,
          notes: watch('notes'),
        }}
      />
    </Transition>
  );
}
