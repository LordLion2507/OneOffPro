import type { ReactNode } from 'react';
import type { CustomerFormData } from '@/data/companion';

type CustomerFormProps = {
  value: CustomerFormData;
  onChange: (field: keyof CustomerFormData, nextValue: string | boolean) => void;
};

function inputClassName() {
  return 'w-full rounded-lg border border-black/15 bg-white px-3 py-2 text-sm text-black outline-none transition focus:border-black/35';
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-black/80">{label}</span>
      {children}
    </label>
  );
}

export default function CustomerForm({ value, onChange }: CustomerFormProps) {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        <Field label="KundenID">
          <input className={inputClassName()} value={value.kundenId} onChange={(e) => onChange('kundenId', e.target.value)} />
        </Field>
        <Field label="Anrede">
          <select className={inputClassName()} value={value.anrede} onChange={(e) => onChange('anrede', e.target.value)}>
            <option value="">-</option>
            <option value="Herr">Herr</option>
            <option value="Frau">Frau</option>
          </select>
        </Field>
        <Field label="Geburtstag">
          <input type="date" className={inputClassName()} value={value.geburtstag} onChange={(e) => onChange('geburtstag', e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Vorname"><input className={inputClassName()} value={value.vorname} onChange={(e) => onChange('vorname', e.target.value)} /></Field>
        <Field label="Nachname"><input className={inputClassName()} value={value.nachname} onChange={(e) => onChange('nachname', e.target.value)} /></Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Straße"><input className={inputClassName()} value={value.strasse} onChange={(e) => onChange('strasse', e.target.value)} /></Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="PLZ"><input className={inputClassName()} value={value.plz} onChange={(e) => onChange('plz', e.target.value)} /></Field>
          <Field label="Ort"><input className={inputClassName()} value={value.ort} onChange={(e) => onChange('ort', e.target.value)} /></Field>
          <Field label="Land"><input className={inputClassName()} value={value.land} onChange={(e) => onChange('land', e.target.value)} /></Field>
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Telefon"><input className={inputClassName()} value={value.telefon} onChange={(e) => onChange('telefon', e.target.value)} /></Field>
        <Field label="E-Mail"><input className={inputClassName()} value={value.email} onChange={(e) => onChange('email', e.target.value)} /></Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Kommunikationssprache"><input className={inputClassName()} value={value.kommunikationssprache} onChange={(e) => onChange('kommunikationssprache', e.target.value)} /></Field>
        <Field label="Markt"><input className={inputClassName()} value={value.markt} onChange={(e) => onChange('markt', e.target.value)} /></Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Berater"><input className={inputClassName()} value={value.berater} onChange={(e) => onChange('berater', e.target.value)} /></Field>
        <Field label="Priorität"><input className={inputClassName()} value={value.prioritaet} onChange={(e) => onChange('prioritaet', e.target.value)} /></Field>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <Field label="Ansprechpartner (Markt)"><input className={inputClassName()} value={value.ansprechpartner} onChange={(e) => onChange('ansprechpartner', e.target.value)} /></Field>
        <Field label="Ansprechpartner (Tel)"><input className={inputClassName()} value={value.ansprechpartnerTel} onChange={(e) => onChange('ansprechpartnerTel', e.target.value)} /></Field>
        <Field label="Ansprechpartner (Mail)"><input className={inputClassName()} value={value.ansprechpartnerMail} onChange={(e) => onChange('ansprechpartnerMail', e.target.value)} /></Field>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Anlagedatum"><input type="date" className={inputClassName()} value={value.anlagedatum} onChange={(e) => onChange('anlagedatum', e.target.value)} /></Field>
        <Field label="Letzter PEP-Check"><input type="date" className={inputClassName()} value={value.letzterPepCheck} onChange={(e) => onChange('letzterPepCheck', e.target.value)} /></Field>
      </div>

      <div className="space-y-2 rounded-lg border border-black/10 bg-neutral-50 p-3">
        <p className="text-xs font-medium text-black/80">Interessiert an</p>
        <label className="mr-4 inline-flex items-center gap-2 text-sm text-black">
          <input type="checkbox" checked={value.interesseOneOff} onChange={(e) => onChange('interesseOneOff', e.target.checked)} /> One-Off
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-black">
          <input type="checkbox" checked={value.interesseReCommissioning} onChange={(e) => onChange('interesseReCommissioning', e.target.checked)} /> Re-Commissioning
        </label>
      </div>

      <Field label="Bemerkung">
        <textarea className={`${inputClassName()} min-h-24`} value={value.bemerkung} onChange={(e) => onChange('bemerkung', e.target.value)} />
      </Field>

      <Field label="Projekt-/Infofeld">
        <textarea className={`${inputClassName()} min-h-28`} value={value.infofeld} onChange={(e) => onChange('infofeld', e.target.value)} />
      </Field>
    </div>
  );
}
