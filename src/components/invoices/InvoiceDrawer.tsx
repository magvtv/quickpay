'use client';

import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PlusIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useInvoiceStore } from '@/stores/invoiceStore';
import { useAuthStore } from '@/stores/authStore';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { invoiceFormSchema, calculateInvoiceTotals, generateInvoiceNumber } from '@/lib/validations/invoiceSchema';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function InvoiceDrawer() {
  const { isDrawerOpen, closeDrawer, createInvoice } = useInvoiceStore();
  const { user } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
                    <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200">
                      <div className="flex items-center gap-4">
                        <Dialog.Title className="text-xl font-semibold text-gray-900">
                          Create new invoice
                        </Dialog.Title>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {watch('invoice_number')}
                          </span>
                          <button
                            type="button"
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          >
                            <DocumentDuplicateIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={closeDrawer}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XMarkIcon className="w-6 h-6" />
                      </button>
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
                            className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <Input
                          label="Project / Description"
                          {...register('notes')}
                          placeholder="e.g., Legal Consulting"
                          error={errors.notes?.message}
                        />

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            label="Issued on"
                            type="date"
                            {...register('issue_date')}
                            error={errors.issue_date?.message}
                          />
                          <Input
                            label="Due on"
                            type="date"
                            {...register('due_date')}
                            error={errors.due_date?.message}
                          />
                        </div>

                        {/* Recurring Checkbox */}
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            {...register('is_recurring')}
                            id="recurring"
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="recurring" className="text-sm text-gray-700">
                            This is a recurring invoice (monthly)
                          </label>
                        </div>

                        {/* Line Items */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-3">
                            Items
                          </label>
                          <div className="space-y-3">
                            {fields.map((field, index) => (
                              <div
                                key={field.id}
                                className="grid grid-cols-12 gap-3 items-start p-4 bg-gray-50 rounded-lg"
                              >
                                {/* Description */}
                                <div className="col-span-5">
                                  <input
                                    {...register(`items.${index}.description`)}
                                    placeholder="Item description"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* Quantity */}
                                <div className="col-span-2">
                                  <input
                                    type="number"
                                    {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                                    placeholder="Qty"
                                    min="1"
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  />
                                </div>

                                {/* Total */}
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={(items[index].quantity * items[index].unit_price).toFixed(2)}
                                    disabled
                                    className="w-full px-3 py-2 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-600"
                                  />
                                </div>

                                {/* Remove Button */}
                                <div className="col-span-1 flex items-center justify-center">
                                  {fields.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => remove(index)}
                                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <XMarkIcon className="w-5 h-5" />
                                    </button>
                                  )}
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
                        </div>

                        {/* Totals */}
                        <div className="pt-6 border-t border-gray-200 space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-semibold text-gray-900">
                              ${subtotal.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tax ({taxRate}%)</span>
                            <span className="font-semibold text-gray-900">
                              ${tax_amount.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            <span className="text-base font-medium text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-gray-900">
                              ${total.toFixed(2)}
                            </span>
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
                            placeholder="Add any additional notes for the client"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between px-8 py-6 bg-gray-50 border-t border-gray-200">
                      <button
                        type="button"
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 uppercase tracking-wide"
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
                          className="px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors uppercase tracking-wide"
                        >
                          SAVE AS DRAFT
                        </button>
                        <Button
                          type="submit"
                          variant="primary"
                          isLoading={isSubmitting}
                          className="uppercase tracking-wide"
                        >
                          SEND
                        </Button>
                      </div>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
