import { useState, type ReactNode } from 'react'
import { Check, ImagePlus, Pencil, Plus, Trash2, X } from 'lucide-react'
import { CATEGORIES } from '../data/productInfo'
import type { ShopProduct } from '../lib/catalog'
import {
  imageFileError,
  MAX_PRODUCT_IMAGES,
  uploadDressImage,
  useDresses,
  type DressEdit,
  type DressImage,
  type DressVariation,
} from '../lib/dresses'

function blankVariation(key: string): DressVariation {
  return { key, price: '', images: [] }
}

function fromProduct(product: ShopProduct, edits: DressEdit[]): DressEdit {
  const saved = edits.find((edit) => edit.id === product.id && !edit.removed)
  if (saved) return structuredClone(saved)
  const groups = new Map<string, DressVariation>()
  for (const image of product.images) {
    const key = image.key || String(product.id)
    const group = groups.get(key) ?? blankVariation(key)
    if (image.src) group.images.push({ id: image.file || image.key, src: image.src })
    groups.set(key, group)
  }
  if (!groups.has(String(product.id))) groups.set(String(product.id), blankVariation(String(product.id)))
  const ordered = [...groups.values()].sort((a, b) => a.key.localeCompare(b.key, undefined, { numeric: true }))
  const parent = ordered.find((variation) => variation.key === String(product.id))
  if (parent && product.price) parent.price = String(product.price)
  return {
    id: product.id,
    parentName: product.name,
    category: product.category,
    variations: ordered,
  }
}

export default function DressTable() {
  const { products, edits, saveDress, removeDress } = useDresses()
  const [drafts, setDrafts] = useState<Record<number, DressEdit>>({})
  const [openId, setOpenId] = useState<number | null>(null)
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const [adding, setAdding] = useState(false)

  function draftFor(product: ShopProduct) {
    return drafts[product.id] ?? fromProduct(product, edits)
  }

  function update(id: number, recipe: (draft: DressEdit) => DressEdit, product?: ShopProduct) {
    setDrafts((current) => {
      const base = current[id] ?? (product ? fromProduct(product, edits) : undefined)
      if (!base) return current
      return { ...current, [id]: recipe(base) }
    })
    setOpenId(id)
  }

  async function persist(edit: DressEdit) {
    if (!edit.parentName.trim()) {
      setNotice('Enter a product type name before saving.')
      return
    }
    setBusy(true)
    try {
      await saveDress(edit)
      setNotice(`${edit.parentName.trim()} saved. The shop is using this name, price, and photos.`)
      setOpenId(null)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Save failed.'
      setNotice(message || 'Save failed. Try a smaller image.')
    } finally {
      setBusy(false)
    }
  }

  async function createProduct(input: { name: string; amount: string; files: File[] }) {
    const id = Math.max(0, ...products.map((product) => product.id), ...edits.map((edit) => edit.id)) + 1
    const images: DressImage[] = []
    for (const file of input.files) {
      images.push(await uploadDressImage(file))
    }
    await saveDress({
      id,
      parentName: input.name.trim(),
      category: CATEGORIES[0],
      variations: [{ key: String(id), price: input.amount.trim(), images }],
    })
    setNotice(`${input.name.trim()} is on the shop.`)
  }

  async function addPhotos(product: ShopProduct, variationKey: string, list: FileList | null) {
    if (!list?.length) return
    const images = []
    for (const file of Array.from(list)) {
      const problem = imageFileError(file)
      if (problem) {
        setNotice(problem)
        continue
      }
      images.push(await uploadDressImage(file))
    }
    if (!images.length) return
    update(
      product.id,
      (item) => ({
        ...item,
        variations: item.variations.map((row) =>
          row.key === variationKey ? { ...row, images: [...row.images, ...images] } : row,
        ),
      }),
      product,
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-8 pt-[4.4rem] sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow">Studio</p>
          <h1 className="mt-1 text-[2rem]">Dress table</h1>
        </div>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-burgundy text-white shadow-sm disabled:opacity-40"
          aria-label="Add product"
          title="Add product"
          onClick={() => setAdding(true)}
          disabled={busy}
        >
          <Plus size={20} />
        </button>
      </div>
      <p className="mt-2 max-w-3xl text-xs leading-relaxed text-muted">
        A product type is the parent. Product Type 1 includes 1, 1.1, 1.2, and 1.3. Saving the parent name updates every variation.
        Deleting a variation removes only that row. Deleting the product type removes the parent and every variation under it.
      </p>
      {notice && <p className="mt-2 text-xs text-burgundy">{notice}</p>}
      {adding && (
        <AddProductModal
          onClose={() => setAdding(false)}
          onSave={async (input) => {
            setBusy(true)
            try {
              await createProduct(input)
              setAdding(false)
            } finally {
              setBusy(false)
            }
          }}
        />
      )}

      <div className="mt-4 space-y-3 md:hidden">
        {products.map((product, productIndex) => {
          const draft = draftFor(product)
          const editing = openId === product.id
          return (
            <article key={product.id} className="overflow-hidden rounded-2xl border border-beige bg-ivory">
              <div className="flex items-start gap-3 border-b border-beige/80 px-3 py-3">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cream text-xs font-semibold text-burgundy">
                  {productIndex + 1}
                </span>
                <div className="min-w-0 flex-1">
                  {editing ? (
                    <input
                      value={draft.parentName}
                      onChange={(e) => update(product.id, (item) => ({ ...item, parentName: e.target.value }), product)}
                      className="w-full rounded-lg border border-beige bg-cream px-2 py-1.5 text-sm text-ink"
                      aria-label="Product type name"
                    />
                  ) : (
                    <p className="font-display text-lg leading-snug font-semibold break-words text-ink">{draft.parentName}</p>
                  )}
                  <p className="mt-0.5 text-[11px] text-muted">{draft.variations.map((row) => row.key).join(' · ')}</p>
                </div>
                <RowActions
                  editing={editing}
                  busy={busy}
                  showEdit
                  onEdit={() => setOpenId(product.id)}
                  onSave={() => void persist(draft)}
                  onAdd={() => {
                    const childCount = draft.variations.filter((row) => row.key !== String(product.id)).length + 1
                    update(product.id, (item) => ({
                      ...item,
                      variations: [...item.variations, blankVariation(`${product.id}.${childCount}`)],
                    }), product)
                  }}
                  onDelete={() => {
                    void removeDress(product.id).then(() =>
                      setNotice(`Product type ${draft.parentName} and all of its variations were removed.`),
                    )
                  }}
                  deleteLabel={`Delete product type ${draft.parentName}`}
                />
              </div>
              <ul>
                {draft.variations.map((variation) => {
                  const isParent = variation.key === String(product.id)
                  return (
                    <li key={variation.key} className="flex items-center gap-3 border-t border-beige/70 px-3 py-2.5">
                      <PhotoSlot
                        images={variation.images}
                        editing={editing}
                        label={`Photos for ${variation.key}`}
                        onPick={(list) => void addPhotos(product, variation.key, list)}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] tracking-wide text-muted uppercase">{variation.key}</p>
                        {editing ? (
                          <input
                            value={variation.price}
                            inputMode="decimal"
                            onChange={(e) =>
                              update(
                                product.id,
                                (item) => ({
                                  ...item,
                                  variations: item.variations.map((row) =>
                                    row.key === variation.key ? { ...row, price: e.target.value } : row,
                                  ),
                                }),
                                product,
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-beige bg-cream px-2 py-1.5 text-sm"
                            aria-label={`Amount for ${variation.key}`}
                          />
                        ) : (
                          <p className="price text-sm">{variation.price ? `₹${Number(variation.price).toLocaleString('en-IN')}` : '—'}</p>
                        )}
                      </div>
                      {!isParent && (
                        <IconButton
                          label={`Delete variation ${variation.key}`}
                          onClick={() => {
                            const next = { ...draft, variations: draft.variations.filter((row) => row.key !== variation.key) }
                            setDrafts((current) => ({ ...current, [product.id]: next }))
                            void persist(next)
                          }}
                        >
                          <Trash2 size={15} />
                        </IconButton>
                      )}
                    </li>
                  )
                })}
              </ul>
            </article>
          )
        })}
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-beige bg-ivory shadow-sm md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-cream text-[10px] tracking-[0.12em] text-burgundy uppercase">
            <tr>
              <th className="px-2 py-2 font-semibold">Sno</th>
              <th className="px-2 py-2 font-semibold">Image</th>
              <th className="px-2 py-2 font-semibold">Product Name</th>
              <th className="px-2 py-2 font-semibold">Amount</th>
              <th className="px-2 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, productIndex) => {
              const draft = draftFor(product)
              const editing = openId === product.id
              return draft.variations.map((variation, index) => {
                const isParent = variation.key === String(product.id)
                return (
                  <tr key={`${product.id}-${variation.key}`} className="border-t border-beige/80 align-middle">
                    {index === 0 && (
                      <td className="px-2 py-1.5 text-base font-semibold text-ink" rowSpan={draft.variations.length}>
                        {productIndex + 1}
                      </td>
                    )}
                    <td className="px-3 py-2">
                      <PhotoSlot
                        images={variation.images}
                        editing={editing}
                        label={`Photos for ${variation.key}`}
                        onPick={(list) => void addPhotos(product, variation.key, list)}
                      />
                    </td>
                    {index === 0 && (
                    <td className="px-2 py-1.5 align-middle" rowSpan={draft.variations.length}>
                      {editing ? (
                        <input
                          value={draft.parentName}
                          onChange={(e) =>
                            update(product.id, (item) => ({ ...item, parentName: e.target.value }), product)
                          }
                          className="w-full rounded-md border border-beige bg-cream px-2 py-1.5 text-base text-ink"
                          aria-label="Product type name"
                        />
                      ) : (
                        <p className="font-display text-lg leading-snug font-semibold break-words text-ink">{draft.parentName}</p>
                      )}
                      <p className="mt-0.5 text-xs text-muted">
                        {draft.variations.map((row) => row.key).join(' · ')}
                      </p>
                    </td>
                    )}
                    <td className="px-2 py-1.5">
                      {editing ? (
                        <input
                          value={variation.price}
                          onChange={(e) =>
                            update(
                              product.id,
                              (item) => ({
                                ...item,
                                variations: item.variations.map((row) =>
                                  row.key === variation.key ? { ...row, price: e.target.value } : row,
                                ),
                              }),
                              product,
                            )
                          }
                          className="w-24 rounded-md border border-beige bg-cream px-2 py-1"
                          aria-label={`Amount for ${variation.key}`}
                        />
                      ) : (
                        <span className="price">{variation.price ? `₹${Number(variation.price).toLocaleString('en-IN')}` : '—'}</span>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <RowActions
                        editing={editing}
                        busy={busy}
                        showEdit={index === 0}
                        showAdd={index === 0 && editing}
                        onEdit={() => setOpenId(product.id)}
                        onSave={() => void persist(draft)}
                        onAdd={() => {
                          const childCount = draft.variations.filter((row) => row.key !== String(product.id)).length + 1
                          update(product.id, (item) => ({
                            ...item,
                            variations: [...item.variations, blankVariation(`${product.id}.${childCount}`)],
                          }), product)
                        }}
                        onDelete={() => {
                          if (isParent) {
                            void removeDress(product.id).then(() =>
                              setNotice(`Product type ${draft.parentName} and all of its variations were removed.`),
                            )
                            return
                          }
                          const next = {
                            ...draft,
                            variations: draft.variations.filter((row) => row.key !== variation.key),
                          }
                          setDrafts((current) => ({ ...current, [product.id]: next }))
                          void persist(next)
                        }}
                        deleteLabel={isParent ? `Delete product type ${draft.parentName}` : `Delete variation ${variation.key}`}
                      />
                    </td>
                  </tr>
                )
              })
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function AddProductModal({
  onClose,
  onSave,
}: {
  onClose: () => void
  onSave: (input: { name: string; amount: string; files: File[] }) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [files, setFiles] = useState<{ file: File; preview: string }[]>([])
  const [error, setError] = useState('')
  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  function addFiles(list: FileList | null) {
    if (!list?.length) return
    const next = [...files]
    for (const file of Array.from(list)) {
      const problem = imageFileError(file)
      if (problem) {
        setError(problem)
        continue
      }
      if (next.length >= MAX_PRODUCT_IMAGES) {
        setError(`You can add up to ${MAX_PRODUCT_IMAGES} photos.`)
        break
      }
      next.push({ file, preview: URL.createObjectURL(file) })
    }
    setFiles(next)
  }

  function removeFile(preview: string) {
    URL.revokeObjectURL(preview)
    setFiles((current) => current.filter((item) => item.preview !== preview))
  }

  async function save() {
    if (!name.trim()) {
      setError('Enter a product name.')
      return
    }
    if (!amount.trim() || !Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      setError('Enter a valid amount.')
      return
    }
    if (!files.length) {
      setError('Add at least one photo.')
      return
    }
    setSaving(true)
    setError('')
    setStatus('Uploading photos…')
    try {
      await onSave({ name, amount, files: files.map((item) => item.file) })
      files.forEach((item) => URL.revokeObjectURL(item.preview))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save this product.')
      setStatus('')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 px-4" role="dialog" aria-modal="true" aria-label="Add product">
      <form
        className="w-full max-w-md rounded-2xl border border-beige bg-ivory p-4 shadow-xl"
        onSubmit={(e) => {
          e.preventDefault()
          void save()
        }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl">Add product</h2>
          <button type="button" className="icon-btn" aria-label="Close" onClick={onClose} disabled={saving}>
            <X size={18} />
          </button>
        </div>
        <label className="mt-3 block text-xs text-muted">
          Product name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-ink"
            required
          />
        </label>
        <label className="mt-2 block text-xs text-muted">
          Product amount
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            className="mt-1 w-full rounded-lg border border-beige bg-cream px-3 py-2 text-sm text-ink"
            required
          />
        </label>
        <label className="mt-2 block text-xs text-muted">
          Product images
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp"
            multiple
            className="mt-1 block w-full text-xs"
            onChange={(e) => {
              addFiles(e.target.files)
              e.currentTarget.value = ''
            }}
          />
        </label>
        <p className="mt-1 text-[11px] text-muted">JPG, PNG, or WEBP. Up to {MAX_PRODUCT_IMAGES} photos, 6 MB each.</p>
        {files.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {files.map((item) => (
              <div key={item.preview} className="relative">
                <img src={item.preview} alt="" className="h-16 w-12 rounded object-cover" />
                <button
                  type="button"
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-burgundy text-white"
                  aria-label="Remove image"
                  onClick={() => removeFile(item.preview)}
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}
        {error && <p className="mt-2 text-xs text-burgundy">{error}</p>}
        {status && <p className="mt-2 text-xs text-muted">{status}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="btn btn-outline !min-h-10" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn !min-h-10" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}

function IconButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-beige text-burgundy transition hover:bg-cream disabled:opacity-40"
    >
      {children}
    </button>
  )
}

function RowActions({
  editing,
  busy,
  showEdit,
  showAdd,
  onEdit,
  onSave,
  onAdd,
  onDelete,
  deleteLabel,
}: {
  editing: boolean
  busy: boolean
  showEdit?: boolean
  showAdd?: boolean
  onEdit: () => void
  onSave: () => void
  onAdd: () => void
  onDelete: () => void
  deleteLabel: string
}) {
  return (
    <div className="flex items-center gap-1">
      {showEdit &&
        (editing ? (
          <IconButton label="Save" onClick={onSave} disabled={busy}>
            <Check size={16} />
          </IconButton>
        ) : (
          <IconButton label="Edit" onClick={onEdit}>
            <Pencil size={15} />
          </IconButton>
        ))}
      {showEdit && editing && (showAdd ?? true) && (
        <IconButton label="Add variation" onClick={onAdd}>
          <Plus size={16} />
        </IconButton>
      )}
      <IconButton label={deleteLabel} onClick={onDelete}>
        <Trash2 size={15} />
      </IconButton>
    </div>
  )
}

function PhotoSlot({
  images,
  editing,
  label,
  onPick,
}: {
  images: DressVariation['images']
  editing: boolean
  label: string
  onPick: (files: FileList | null) => void
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Thumb images={images} />
      {editing && (
        <label className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-beige text-burgundy" title={label}>
          <ImagePlus size={15} />
          <span className="sr-only">{label}</span>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp"
            multiple
            className="sr-only"
            onChange={(e) => {
              onPick(e.target.files)
              e.currentTarget.value = ''
            }}
          />
        </label>
      )}
    </div>
  )
}

function Thumb({ images }: { images: DressVariation['images'] }) {
  const src = images[0]?.src
  if (!src) return <span className="inline-flex h-10 w-8 items-center justify-center rounded bg-cream text-[9px] text-muted">None</span>
  return <img src={src} alt="" className="h-10 w-8 rounded object-cover" />
}
