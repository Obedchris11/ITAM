"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AlertPopup } from "@/components/ui/alert"

export default function RegistrasiHardware() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    merekPerangkat: '',
    namaSuplier: '',
    nomorNota: '',
    lokasiPenerima: '',
    tanggalWaktuPenerimaan: '',
    masaGaransiMulai: '',
    penanggungJawabPerangkat: '',
    model: '',
    serialNumber: '',
    tandaTerima: null as File | null,
    kondisiAset: '',
    tipePerangkat: '',
    tanggalAktivasiPerangkat: '',
    masaBerakhirGaransi: '',
    hasilPemeriksaanPerangkat: '',
    jangkaMasaPakaiPerangkat: '',
    statusPerangkat:'',
    tanggalAsetKeluar: '',
    divisiPengguna: '',
    notaPembelian:'',
    detailSpesifikasiPerangkat:'',
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
      'merekPerangkat','namaSuplier','nomorNota','lokasiPenerima',
      'tanggalWaktuPenerimaan','masaGaransiMulai','penanggungJawabPerangkat','model','serialNumber',
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
      'merekPerangkat','namaSuplier','nomorNota','lokasiPenerima',
      'tanggalWaktuPenerimaan','masaGaransiMulai','penanggungJawabPerangkat','model',
      'serialNumber','tandaTerima','kondisiAset','tipePerangkat',
      'tanggalAktivasiPerangkat','masaBerakhirGaransi','hasilPemeriksaanPerangkat','jangkaMasaPakaiPerangkat',
      'statusPerangkat','tanggalAsetKeluar','divisiPengguna','notaPembelian','detailSpesifikasiPerangkat',
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
        console.log('Setting success alert')
        setAlert({ type: 'success', message: 'Data berhasil disimpan!' })
        // Reset form after successful submission
        setFormData({
          merekPerangkat: '',
          namaSuplier: '',
          nomorNota: '',
          lokasiPenerima: '',
          tanggalWaktuPenerimaan: '',
          masaGaransiMulai: '',
          penanggungJawabPerangkat: '',
          model: '',
          serialNumber: '',
          tandaTerima: null as File | null,
          kondisiAset: '',
          tipePerangkat: '',
          tanggalAktivasiPerangkat: '',
          masaBerakhirGaransi: '',
          hasilPemeriksaanPerangkat: '',
          jangkaMasaPakaiPerangkat: '',
          statusPerangkat:'',
          tanggalAsetKeluar: '',
          divisiPengguna: '',
          notaPembelian:'',
          detailSpesifikasiPerangkat:'',
        })
        // Reset file inputs
        Object.values(fileInputRefs.current).forEach(ref => {
          if (ref) ref.value = ''
        })
        setStep(1)
      }, 1000)
    } else {
      console.log('Setting error alert')
      setAlert({ type: 'error', message: 'Mohon isi semua field yang diperlukan.' })
    }
  }

  useEffect(() => {
    console.log('Current alert state:', alert)
    if (alert) {
      const timer = setTimeout(() => {
        console.log('Clearing alert')
        setAlert(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [alert])

  const renderField = (name: string, label: string, type: string = 'text', options?: string[]) => {
    const isRequired = [
      'merekPerangkat','namaSuplier','nomorNota','lokasiPenerima',
      'tanggalWaktuPenerimaan','masaGaransiMulai','penanggungJawabPerangkat','model',
      'serialNumber','tandaTerima','kondisiAset','tipePerangkat',
      'tanggalAktivasiPerangkat','masaBerakhirGaransi','hasilPemeriksaanPerangkat','jangkaMasaPakaiPerangkat',
      'statusPerangkat','tanggalAsetKeluar','divisiPengguna','notaPembelian','detailSpesifikasiPerangkat',
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
      <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-6">Registrasi Hardware</h1>
      {alert && <AlertPopup type={alert.type} message={alert.message} />}
      {step === 1 && (
        <form onSubmit={handleNext} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            {renderField('merekPerangkat', 'Merek Perangkat')}
            {renderField('namaSuplier', 'Nama Suplier', 'select', ['Suplier 1', 'Suplier 2'])}
            {renderField('nomorNota', 'Nomor Nota')}
            {renderField('lokasiPenerima', 'Lokasi Penerima')}
            {renderField('tanggalWaktuPenerimaan', 'Tanggal, Waktu Penerimaan', 'datetime-local')}
            {renderField('masaGaransiMulai', 'Masa Garansi Mulai')}
          </div>
          <div className="space-y-6">
            {renderField('penanggungJawabPerangkat', 'Penanggung Jawab Perangkat', 'select', ['roy', 'navis'])}
            {renderField('model', 'Model', 'select', ['normal', 'geming bos'])}
            {renderField('serialNumber', 'Serial Number', 'date')}
          </div>
          <div className="md:col-start-2 md:col-span-1 flex justify-end">
            <Button type="submit" className="w-full sm:w-auto">Next</Button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
          {renderField('tandaTerima', 'Tanda Terima', 'file')}
          {renderField('kondisiAset', 'Kondisi Aset')}
          {renderField('tipePerangkat', 'Tipe Perangkat')}
          {renderField('tanggalAktivasiPerangkat', 'Tanggal Aktivasi Perangkat', 'date')}
          {renderField('masaBerakhirGaransi', 'Masa Berakhir Garansi', 'date')}
          {renderField('hasilPemeriksaanPerangkat', 'Hasil Pemeriksaan Perangkat')}
          {renderField('jangkaMasaPakaiPerangkat', 'Jangka Masa Pakai Perangkat', 'number')}
          </div>
          <div className="space-y-6">
            {renderField('statusPerangkat', 'Status Perangkat')}
            {renderField('tanggalAsetKeluar', 'Tanggal Aset Keluar', 'date')}
            {renderField('divisiPengguna', 'Divisi Pengguna')}
            {renderField('notaPembelian', 'Nota Pembelian')}
            {renderField('detailSpesifikasiPerangkat', 'Detail Spesifikasi Perangkat', 'textarea')}
          </div>
          <div className="md:col-span-2 flex justify-between">
            <Button type="button" onClick={handleBack} className="w-full md:w-auto">Back</Button>
            <Button type="submit" className="w-full md:w-auto">Submit</Button>
          </div>
        </form>
      )}
    </div>
  )
}