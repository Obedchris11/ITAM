"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertPopup } from "@/components/ui/alert"

export default function RegistrasiElektronik() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    namaSuplier: '',
    nomorNota: '',
    lokasiPenerima: '',
    tanggalWaktuPenerimaan: '',
    tandaTerima: null as File | null,
    tanggalAktivasiPerangkat: '',
    divisiPengguna: '',
    tipeAset: '',
    kondisiAset: '',
    nilaiAset: '',
    depresiasiPerTahun: '',
    statusAset: '',
    hasilPemeriksaanAset: '',
    penanggungJawabAset: '',
    notaPembelian: null as File | null,
    lokasiPenyimpanan: '',
    model: '',
    nomorKartuGaransi: '',
    masaGaransiMulai: '',
    masaBerakhirGaransi: '',
    serialNumber: '',
    jangkaMasaPakaiAset: '',
    tanggalAsetKeluar: '',
    merek: '',
    processor: '',
    ram: '',
    tipeRam: '',
    rom: '',
    tipePenyimpanan: ''
  })
  const [alert, setAlert] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      setFormData(prevData => ({
        ...prevData,
        [name]: fileInput.files ? fileInput.files[0] : null
      }))
    } else {
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }))
    }
  }

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }))
  }

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault()
    const step1Fields = [
      'namaSuplier', 'nomorNota', 'lokasiPenerima', 'tanggalWaktuPenerimaan',
      'tandaTerima', 'tanggalAktivasiPerangkat', 'divisiPengguna', 'tipeAset',
      'kondisiAset', 'nilaiAset', 'statusAset', 'penanggungJawabAset'
    ]
    const newErrors: Record<string, string> = {}
    step1Fields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })
    setErrors(newErrors)
    if (Object.keys(newErrors).length === 0) {
      setStep(2)
    } else {
      setAlert({ type: 'error', message: 'Mohon isi semua field yang diperlukan.' })
    }
  }

  const handleBack = () => {
    setStep(1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const requiredFields = [
      'namaSuplier', 'nomorNota', 'lokasiPenerima', 'tanggalWaktuPenerimaan',
      'tandaTerima', 'tanggalAktivasiPerangkat', 'divisiPengguna', 'tipeAset',
      'kondisiAset', 'nilaiAset', 'statusAset', 'penanggungJawabAset',
      'notaPembelian', 'model', 'serialNumber', 'merek', 'processor', 'ram', 'rom'
    ]

    const newErrors: Record<string, string> = {}
    requiredFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field] = 'Field ini wajib diisi'
      }
    })
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      // Simulate API call
      setTimeout(() => {
        console.log('Data saved:', formData)
        setAlert({ type: 'success', message: 'Data berhasil disimpan!' })
        // Reset form after successful submission
        setFormData({
          namaSuplier: '',
          nomorNota: '',
          lokasiPenerima: '',
          tanggalWaktuPenerimaan: '',
          tandaTerima: null,
          tanggalAktivasiPerangkat: '',
          divisiPengguna: '',
          tipeAset: '',
          kondisiAset: '',
          nilaiAset: '',
          depresiasiPerTahun: '',
          statusAset: '',
          hasilPemeriksaanAset: '',
          penanggungJawabAset: '',
          notaPembelian: null,
          lokasiPenyimpanan: '',
          model: '',
          nomorKartuGaransi: '',
          masaGaransiMulai: '',
          masaBerakhirGaransi: '',
          serialNumber: '',
          jangkaMasaPakaiAset: '',
          tanggalAsetKeluar: '',
          merek: '',
          processor: '',
          ram: '',
          tipeRam: '',
          rom: '',
          tipePenyimpanan: ''
        })
        // Reset file inputs
        Object.values(fileInputRefs.current).forEach(ref => {
          if (ref) ref.value = ''
        })
        setStep(1) // Reset to step 1 after successful submission
      }, 1000)
    } else {
      setAlert({ type: 'error', message: 'Mohon isi semua field yang diperlukan.' })
    }
  }

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null)
      }, 5000) // Alert will disappear after 5 seconds
      return () => clearTimeout(timer)
    }
  }, [alert])

  const renderField = (name: string, label: string, type: string = 'text', options?: string[]) => {
    const isRequired = [
      'namaSuplier', 'nomorNota', 'lokasiPenerima', 'tanggalWaktuPenerimaan',
      'tandaTerima', 'tanggalAktivasiPerangkat', 'divisiPengguna', 'tipeAset',
      'kondisiAset', 'nilaiAset', 'statusAset', 'penanggungJawabAset',
      'notaPembelian', 'model', 'serialNumber', 'merek', 'processor', 'ram', 'rom'
    ].includes(name)

    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="flex">
          {label}
          {isRequired && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {type === 'select' && options ? (
          <Select onValueChange={handleSelectChange(name)} value={formData[name as keyof typeof formData] as string}>
            <SelectTrigger id={name} className={errors[name] ? 'border-red-500' : ''}>
              <SelectValue placeholder={`Pilih ${label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : type === 'file' ? (
          <Input
            id={name}
            name={name}
            type={type}
            onChange={handleInputChange}
            className={errors[name] ? 'border-red-500' : ''}
            ref={(el: HTMLInputElement | null) => {
              fileInputRefs.current[name] = el
            }}
          />
        ) : type === 'textarea' ? (
          <Textarea
            id={name}
            name={name}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleInputChange}
            className={errors[name] ? 'border-red-500' : ''}
            rows={4}
          />
        ) : (
          <Input
            id={name}
            name={name}
            type={type}
            value={formData[name as keyof typeof formData] as string}
            onChange={handleInputChange}
            className={errors[name] ? 'border-red-500' : ''}
          />
        )}
        {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-4xl">
      <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-6">Registrasi Perangkat Elektronik</h1>
      {alert && (
        <AlertPopup
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert(null)}
        />
      )}
      {step === 1 && (
        <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {renderField('namaSuplier', 'Nama Suplier', 'select', ['Suplier 1', 'Suplier 2'])}
            {renderField('nomorNota', 'Nomor Nota')}
            {renderField('lokasiPenerima', 'Lokasi Penerima')}
            {renderField('tanggalWaktuPenerimaan', 'Tanggal, Waktu Penerimaan', 'datetime-local')}
            {renderField('tandaTerima', 'Tanda Terima', 'file')}
            {renderField('tanggalAktivasiPerangkat', 'Tanggal Aktivasi Perangkat', 'date')}
            {renderField('divisiPengguna', 'Divisi Pengguna', 'select', ['Divisi 1', 'Divisi 2'])}
          </div>
          <div className="space-y-6">
            {renderField('tipeAset', 'Tipe Aset', 'select', ['Tipe 1', 'Tipe 2'])}
            {renderField('kondisiAset', 'Kondisi Aset', 'select', ['Baru', 'Bekas'])}
            {renderField('nilaiAset', 'Nilai Aset', 'number')}
            {renderField('depresiasiPerTahun', 'Depresiasi per tahun', 'number')}
            {renderField('statusAset', 'Status Aset', 'select', ['Aktif', 'Non-Aktif'])}
            {renderField('hasilPemeriksaanAset', 'Hasil Pemeriksaan Aset', 'textarea')}
            {renderField('penanggungJawabAset', 'Penanggung Jawab Aset')}
          </div>
          <div className="md:col-start-2 md:col-span-1 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">Next</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderField('notaPembelian', 'Nota Pembelian', 'file')}
          {renderField('lokasiPenyimpanan', 'Lokasi Penyimpanan')}
          {renderField('model', 'Model')}
          {renderField('nomorKartuGaransi', 'Nomor Kartu Garansi')}
          {renderField('masaGaransiMulai', 'Masa Garansi Mulai', 'date')}
          {renderField('masaBerakhirGaransi', 'Masa Berakhir Garansi', 'date')}
          {renderField('serialNumber', 'Serial Number')}
          {renderField('jangkaMasaPakaiAset', 'Jangka Masa Pakai Aset', 'number')}
          {renderField('tanggalAsetKeluar', 'Tanggal Aset Keluar', 'date')}
          {renderField('merek', 'Merek')}
          {renderField('processor', 'Processor')}
          {renderField('ram', 'RAM')}
          {renderField('tipeRam', 'Tipe RAM')}
          {renderField('rom', 'ROM')}
          {renderField('tipePenyimpanan', 'Tipe Penyimpanan')}
          <div className="md:col-span-2 flex justify-between">
            <Button type="button" onClick={handleBack} className="w-full md:w-auto">Back</Button>
            <Button type="submit" className="w-full md:w-auto">Submit</Button>
          </div>
        </form>
      )}
    </div>
  )
}