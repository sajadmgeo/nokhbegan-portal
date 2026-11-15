import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Users, Award, Package, Layers, Search,
  ChevronLeft, ArrowRight, Shield, Lock, Plus, Edit,
  Trash2, Upload, Download, CheckCircle, AlertCircle, X,
  BarChart3, Settings, LogOut, Eye, EyeOff, Globe, Phone,
  MapPin, Calendar, FileText, Briefcase,
  Check, RefreshCw, Star, Database, FileSpreadsheet, Printer,
  History, UserCheck, Sparkles, SlidersHorizontal, Info,
  Mail, Send, Inbox, Archive, FilePlus, FolderOpen, Bell,
  Menu, PanelRightClose, PanelRightOpen, Clock, FileCheck,
  AlertTriangle, CheckSquare, UserPlus, UserMinus, Car, RotateCcw,
  Armchair, ClipboardCheck, Rocket, ClipboardList, Percent
} from 'lucide-react';

// ============================================================================
// ۱. توابع کمکی عمومی، تقویم شمسی و تولید فایل استاندارد Word (.docx)
// ============================================================================

const toPersianDigits = (val) => {
  if (val === null || val === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (x) => persianDigits[x]);
};

const generateSlug = (name) => {
  return (
    String(name || 'company')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
      .toLowerCase() +
    '-' +
    Math.floor(100 + Math.random() * 900)
  );
};

const getTodayJalali = () => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
  } catch {
    return '1405/01/20';
  }
};

const getNowJalaliDateTime = () => {
  try {
    const d = new Date();
    const datePart = new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(d);
    const timePart = new Intl.DateTimeFormat('fa-IR', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
    return `${datePart} ${timePart}`;
  } catch {
    return '1405/01/20 10:30';
  }
};

const maskNationalId = (nid) => {
  const s = String(nid || '').trim();
  if (s.length < 6) return s || '---';
  return `${s.slice(0, 3)}****${s.slice(-3)}`;
};

const escapeXml = (str) =>
  String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

// سازنده آرشیو ZIP بومی برای تولید فایل واقعی Microsoft Word (.docx)
const buildSimpleZipBlob = (files) => {
  const encoder = new TextEncoder();
  const crcTable = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crcTable[i] = c;
  }
  const crc32 = (buf) => {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  };

  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach(({ path, content }) => {
    const nameBytes = encoder.encode(path);
    const dataBytes = encoder.encode(content);
    const crc = crc32(dataBytes);

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, dataBytes.length, true);
    lv.setUint32(22, dataBytes.length, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localParts.push(localHeader, dataBytes);

    const centralHeader = new Uint8Array(46 + nameBytes.length);
    const cv = new DataView(centralHeader.buffer);
    cv.setUint32(0, 0x02014b50, true);
    cv.setUint16(4, 20, true);
    cv.setUint16(6, 20, true);
    cv.setUint16(8, 0x0800, true);
    cv.setUint16(10, 0, true);
    cv.setUint16(12, 0, true);
    cv.setUint16(14, 0, true);
    cv.setUint32(16, crc, true);
    cv.setUint32(20, dataBytes.length, true);
    cv.setUint32(24, dataBytes.length, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralParts.push(centralHeader);
    offset += localHeader.length + dataBytes.length;
  });

  const centralSize = centralParts.reduce((s, p) => s + p.length, 0);
  const endRecord = new Uint8Array(22);
  const ev = new DataView(endRecord.buffer);
  ev.setUint32(0, 0x06054b50, true);
  ev.setUint16(4, 0, true);
  ev.setUint16(6, 0, true);
  ev.setUint16(8, files.length, true);
  ev.setUint16(10, files.length, true);
  ev.setUint32(12, centralSize, true);
  ev.setUint32(16, offset, true);
  ev.setUint16(20, 0, true);

  return new Blob([...localParts, ...centralParts, endRecord], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
};

const downloadDocxFromParagraphs = (filename, paragraphsXml) => {
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphsXml}
    <w:sectPr><w:bidi/></w:sectPr>
  </w:body>
</w:document>`;

  const blob = buildSimpleZipBlob([
    { path: '[Content_Types].xml', content: contentTypes },
    { path: '_rels/.rels', content: rels },
    { path: 'word/document.xml', content: documentXml }
  ]);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const makeRtlParagraph = (text, bold = false, size = 24) => `
  <w:p>
    <w:pPr><w:bidi/><w:jc w:val="right"/></w:pPr>
    <w:r>
      <w:rPr>
        <w:rtl/>
        ${bold ? '<w:b/>' : ''}
        <w:sz w:val="${size}"/>
        <w:szCs w:val="${size}"/>
      </w:rPr>
      <w:t xml:space="preserve">${escapeXml(text)}</w:t>
    </w:r>
  </w:p>`;

const exportLetterToDocx = (letter, settings) => {
  const orgTitle = settings?.orgHeader || 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان';
  const bodyLines = String(letter.body || '').split('\n');
  const xml = [
    makeRtlParagraph(orgTitle, true, 28),
    makeRtlParagraph(`شماره نامه: ${toPersianDigits(letter.indicatorNumber || 'پیش‌نویس')}`, true, 22),
    makeRtlParagraph(`تاریخ: ${toPersianDigits(letter.letterDate || getTodayJalali())}`, false, 22),
    makeRtlParagraph(`موضوع: ${letter.subject || ''}`, true, 24),
    makeRtlParagraph(`گیرنده: ${letter.recipientOrg || ''} - ${letter.recipientPerson || ''}`, false, 22),
    makeRtlParagraph('------------------------------------------------------------', false, 20),
    ...bodyLines.map((line) => makeRtlParagraph(line, false, 24)),
    makeRtlParagraph('', false, 22),
    makeRtlParagraph(`امضاکننده: ${letter.signerName || ''} (${letter.signerTitle || ''})`, true, 22),
    letter.copies ? makeRtlParagraph(`رونوشت: ${letter.copies}`, false, 20) : ''
  ].join('');
  downloadDocxFromParagraphs(`Letter_${letter.indicatorNumber || 'Draft'}.docx`, xml);
};

const exportAssetMinutesToDocx = (company, assets, settings) => {
  const orgTitle = settings?.orgHeader || 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان';
  const rowsXml = assets.map((item, idx) => {
    const q = computeAssetQuantities(item);
    return makeRtlParagraph(
      `${toPersianDigits(idx + 1)}. ${item.itemName} (کد: ${toPersianDigits(item.assetCode || '-')}) | اولیه: ${toPersianDigits(q.initialQty)} | اضافه‌شده: ${toPersianDigits(q.addedQty)} | مسترد: ${toPersianDigits(q.returnedQty)} | موجودی فعلی: ${toPersianDigits(q.currentQty)} | وضعیت: ${item.confirmationStatus}`,
      false,
      22
    );
  });

  const xml = [
    makeRtlParagraph(orgTitle, true, 28),
    makeRtlParagraph(`صورت‌جلسه رسمی تحویل و تحول اموال و تجهیزات — شرکت ${company?.name || ''}`, true, 26),
    makeRtlParagraph(`تاریخ تنظیم صورت‌جلسه: ${toPersianDigits(getTodayJalali())}`, false, 22),
    makeRtlParagraph(`واحد استقرار: ${company?.unitNumber || '---'} | نماینده شرکت: ${company?.ceoName || '---'}`, false, 22),
    makeRtlParagraph('------------------------------------------------------------', false, 20),
    ...rowsXml,
    makeRtlParagraph('', false, 22),
    makeRtlParagraph('امضا و تأیید نماینده مرکز رشد فناوری نخبگان: ____________________', true, 22),
    makeRtlParagraph(`امضا و تأیید الکترونیکی نماینده شرکت (${company?.name || ''}): ____________________`, true, 22)
  ].join('');

  downloadDocxFromParagraphs(`Asset_Minutes_${company?.slug || 'Company'}.docx`, xml);
};

// ============================================================================
// ۲. داده‌های اولیه و ثابت‌های ماژول‌های پنج‌گانه سامانه
// ============================================================================

const INITIAL_COMPANIES = [
  {
    id: 'comp-1',
    rowNumber: '1',
    status: 'فعال',
    level: 'سطح ۱ (رشد پیشرفته)',
    name: 'پارس هوش مصنوعی پردیس',
    slug: 'pars-ai-pardis',
    nationalId: '14008912345',
    registrationNumber: '543210',
    companyType: 'سهامی خاص',
    establishedDate: '1398/05/12',
    registeredCapital: '۵,۰۰۰,۰۰۰,۰۰۰ ریال',
    ceoName: 'دکتر امیرحسین کاظمی',
    ceoPhone: '09123456789',
    ceoNationalId: '0071234567',
    ceoBirthDate: '1365/02/15',
    ceoDegree: 'دکتری تخصصی هوش مصنوعی',
    ceoUniversity: 'دانشگاه صنعتی شریف',
    chairmanName: 'مهندس سارا رضایی',
    chairmanPhone: '09129876543',
    unitNumber: 'واحد ۳۰۴ - ساختمان نخبگان',
    unitArea: '۶۵ مترمربع',
    postalCode: '1657145892',
    visitable: 'بله',
    workshopCode: '0214589632',
    economicCode: '411569874123',
    landline: '021-76250410',
    email: 'info@pars-ai.ir',
    website: 'https://pars-ai.ir',
    initialStaff: 4,
    thirdYearStaff: 18,
    totalStaff: 22,
    femaleStaff: 9,
    knowledgeBased: 'دانش‌بنیان نوپا نوع ۱',
    recruitmentBase: 'فراخوان ۲۱ مرکز رشد',
    field: 'هوش مصنوعی و فناوری اطلاعات',
    techLicense: 'دارد',
    techLicenseTopic: 'سامانه پردازش تصویر صنعتی و کنترل کیفیت هوشمند',
    productCount: 2,
    products: [
      {
        name: 'بیناکنترل پلاس',
        brand: 'BinaControl',
        status: 'تجاری‌سازی شده',
        description: 'سامانه بینایی ماشین جهت تشخیص عیوب خطوط تولید خودروسازی و بسته‌بندی.',
        patent: 'ثبت اختراع شماره ۱۰۴۵۸۹'
      },
      {
        name: 'پلتفرم تحلیل متن فارسی نگار',
        brand: 'NegarNLP',
        status: 'فروش آزمایشی',
        description: 'موتور پردازش زبان طبیعی و خلاصه‌سازی اسناد سازمانی.',
        patent: 'در حال بررسی'
      }
    ],
    entryDate: '1400/02/01',
    preIncubationEndDate: '1400/08/01',
    incubationEntryDate: '1400/08/15',
    threeYearEndDate: '1403/08/15',
    renewalDate: '1404/08/15',
    membershipStatus: 'دوره رشد (تمدید شده)',
    targetAudience: 'کارخانجات تولیدی، صنایع خودروسازی و بانک‌ها',
    investmentRaised: 'بله',
    investmentAmount: '۱۲ میلیارد تومان',
    revenueModel: 'فروش لایسنس سازمانی + قرارداد پشتیبانی سالانه',
    salesYear1: '۱.۲ میلیارد تومان',
    salesYear2: '۴.۸ میلیارد تومان',
    salesYear3: '۱۱.۵ میلیارد تومان',
    salesYear4: '۱۸.۰ میلیارد تومان',
    exitDate: '',
    exitResult: '',
    notes: 'شرکت منتخب جشنواره فناوری پردیس',
    shortDesc: 'توسعه‌دهنده سامانه‌های بینایی ماشین صنعتی و پردازش زبان طبیعی فارسی برای خطوط تولید هوشمند.',
    logoUrl: '',
    isPublic: true,
    isFeatured: true,
    publishInvestment: true,
    publishSales: false,
    locationStatus: 'مستقر در مرکز رشد',
    history: [
      { date: '1403/07/20', user: 'مدیر سامانه', action: 'تأیید انتشار عمومی شناسنامه شرکت' }
    ]
  },
  {
    id: 'comp-2',
    rowNumber: '2',
    status: 'فعال',
    level: 'سطح ۲ (رشد مقدماتی)',
    name: 'زیست‌فناوران نوین ژنوم',
    slug: 'zist-fanavaran-genome',
    nationalId: '14009876543',
    registrationNumber: '568912',
    companyType: 'مسئولیت محدود',
    establishedDate: '1400/09/20',
    registeredCapital: '۲,۰۰۰,۰۰۰,۰۰۰ ریال',
    ceoName: 'دکتر مریم احمدی',
    ceoPhone: '09121112233',
    ceoNationalId: '0089876543',
    ceoBirthDate: '1368/11/04',
    ceoDegree: 'دکتری زیست‌فناوری پزشکی',
    ceoUniversity: 'دانشگاه علوم پزشکی تهران',
    chairmanName: 'دکتر رضا محمدی',
    chairmanPhone: '09124445566',
    unitNumber: 'واحد ۱۰۸ - آزمایشگاه زیست',
    unitArea: '۸۰ مترمربع',
    postalCode: '1657145108',
    visitable: 'بله',
    workshopCode: '0214589700',
    economicCode: '411654987321',
    landline: '021-76250880',
    email: 'contact@genome-bio.ir',
    website: 'https://genome-bio.ir',
    initialStaff: 3,
    thirdYearStaff: 11,
    totalStaff: 14,
    femaleStaff: 10,
    knowledgeBased: 'دانش‌بنیان فناور',
    recruitmentBase: 'پذیرش مستقیم شورای فناوری',
    field: 'زیست‌فناوری و سلامت',
    techLicense: 'دارد',
    techLicenseTopic: 'تولید کیت‌های تشخیص سریع مولکولی بیماری‌های عفونی',
    productCount: 1,
    products: [
      {
        name: 'کیت تشخیص سریع PCR-Rapid',
        brand: 'GenoFast',
        status: 'دارای مجوز تجهیزات پزشکی',
        description: 'کیت تشخیص مولکولی با زمان پاسخ‌دهی زیر ۳۰ دقیقه ویژه آزمایشگاه‌های تشخیص طبی.',
        patent: 'ثبت اختراع شماره ۱۰۹۸۲۱'
      }
    ],
    entryDate: '1401/04/10',
    preIncubationEndDate: '1401/10/10',
    incubationEntryDate: '1401/11/01',
    threeYearEndDate: '1404/11/01',
    renewalDate: '',
    membershipStatus: 'دوره رشد',
    targetAudience: 'آزمایشگاه‌های تشخیص طبی، بیمارستان‌ها و مراکز درمانی',
    investmentRaised: 'بله',
    investmentAmount: '۸ میلیارد تومان',
    revenueModel: 'فروش مستقیم B2B به مراکز آزمایشگاهی و پخش دارویی',
    salesYear1: '۸۰۰ میلیون تومان',
    salesYear2: '۳.۵ میلیارد تومان',
    salesYear3: '۷.۲ میلیارد تومان',
    salesYear4: '',
    exitDate: '',
    exitResult: '',
    notes: 'دارای گواهی ISO 13485',
    shortDesc: 'طراحی و تولید کیت‌های تشخیص مولکولی سریع و آنزیم‌های نوترکیب ویژه آزمایشگاه‌های تشخیص طبی.',
    logoUrl: '',
    isPublic: true,
    isFeatured: true,
    publishInvestment: true,
    publishSales: false,
    locationStatus: 'مستقر در مرکز رشد',
    history: []
  },
  {
    id: 'comp-3',
    rowNumber: '3',
    status: 'فعال',
    level: 'سطح ۱ (رشد پیشرفته)',
    name: 'مکاترونیک و رباتیک سپهر',
    slug: 'sepehr-mechatronics',
    nationalId: '14007654321',
    registrationNumber: '512398',
    companyType: 'سهامی خاص',
    establishedDate: '1397/03/14',
    registeredCapital: '۱۰,۰۰۰,۰۰۰,۰۰۰ ریال',
    ceoName: 'مهندس علیرضا شریفی',
    ceoPhone: '09127778899',
    ceoNationalId: '0065432198',
    ceoBirthDate: '1363/07/22',
    ceoDegree: 'کارشناسی ارشد مهندسی مکاترونیک',
    ceoUniversity: 'دانشگاه صنعتی امیرکبیر',
    chairmanName: 'دکتر حمیدرضا نوری',
    chairmanPhone: '09123334455',
    unitNumber: 'سوله فناوری شماره ۴',
    unitArea: '۱۲۰ مترمربع',
    postalCode: '1657145904',
    visitable: 'بله',
    workshopCode: '0214589112',
    economicCode: '411987654321',
    landline: '021-76250912',
    email: 'info@sepehr-robotics.ir',
    website: 'https://sepehr-robotics.ir',
    initialStaff: 5,
    thirdYearStaff: 24,
    totalStaff: 28,
    femaleStaff: 6,
    knowledgeBased: 'دانش‌بنیان تولیدی',
    recruitmentBase: 'پارک فناوری پردیس',
    field: 'ماشین‌آلات پیشرفته و رباتیک',
    techLicense: 'دارد',
    techLicenseTopic: 'طراحی و ساخت بازوهای رباتیک صنعتی ۶ درجه آزادی و AGV',
    productCount: 1,
    products: [
      {
        name: 'ربات حمل بار خودران سپهر AGV-500',
        brand: 'SepehrBot',
        status: 'تولید انبوه',
        description: 'ربات هوشمند جابجایی پالت در انبارهای لجستیک با ناوبری لیزری.',
        patent: 'ثبت اختراع شماره ۱۰۱۲۳۴'
      }
    ],
    entryDate: '1399/09/01',
    preIncubationEndDate: '1400/03/01',
    incubationEntryDate: '1400/03/15',
    threeYearEndDate: '1403/03/15',
    renewalDate: '1404/03/15',
    membershipStatus: 'آماده خروج به پارک',
    targetAudience: 'صنایع لجستیک، انبارداری هوشمند، فولاد و لوازم خانگی',
    investmentRaised: 'بله',
    investmentAmount: '۲۵ میلیارد تومان',
    revenueModel: 'فروش تجهیزات + طراحی خطوط اتوماسیون سفارشی',
    salesYear1: '۳.۵ میلیارد تومان',
    salesYear2: '۱۲.۰ میلیارد تومان',
    salesYear3: '۲۹.۰ میلیارد تومان',
    salesYear4: '۴۵.۰ میلیارد تومان',
    exitDate: '',
    exitResult: '',
    notes: 'در مرحله انتقال به اراضی پارک فناوری پردیس',
    shortDesc: 'سازنده ربات‌های لجستیک خودران (AGV)، بازوهای رباتیک صنعتی و خطوط مونتاژ تمام‌اتوماتیک.',
    logoUrl: '',
    isPublic: true,
    isFeatured: true,
    publishInvestment: true,
    publishSales: true,
    locationStatus: 'مستقر در مرکز رشد',
    history: []
  },
  {
    id: 'comp-4',
    rowNumber: '4',
    status: 'فعال',
    level: 'سطح ۳ (پیش‌رشد)',
    name: 'هسته فناور نانوپوشش آریا',
    slug: 'nanopooshesh-aria',
    nationalId: '14011998877',
    registrationNumber: '615420',
    companyType: 'هسته فناور',
    establishedDate: '1403/01/20',
    registeredCapital: '۱,۰۰۰,۰۰۰,۰۰۰ ریال',
    ceoName: 'مهندس محمدجواد کریمی',
    ceoPhone: '09351234567',
    ceoNationalId: '0012345678',
    ceoBirthDate: '1374/04/10',
    ceoDegree: 'کارشناسی ارشد مهندسی مواد و نانوفناوری',
    ceoUniversity: 'دانشگاه علم و صنعت ایران',
    chairmanName: 'مهندس محمدجواد کریمی',
    chairmanPhone: '09351234567',
    unitNumber: 'فضای کار اشتراکی - میز ۱۲',
    unitArea: '۱۵ مترمربع',
    postalCode: '1657145012',
    visitable: 'خیر',
    workshopCode: '',
    economicCode: '',
    landline: '021-76250112',
    email: 'aria.nanocoat@gmail.com',
    website: '',
    initialStaff: 3,
    thirdYearStaff: 0,
    totalStaff: 4,
    femaleStaff: 2,
    knowledgeBased: 'خیر (در مسیر دانش‌بنیان)',
    recruitmentBase: 'دوره آماده‌سازی مسیر ۲۳',
    field: 'مواد پیشرفته و فناوری نانو',
    techLicense: 'در دست اقدام',
    techLicenseTopic: 'پوشش‌های نانوپلیمری ضدخوردگی و آب‌گریز صنعتی',
    productCount: 1,
    products: [
      {
        name: 'پوشش نانویی ضدخوردگی مبدل‌های حرارتی',
        brand: 'AriaShield',
        status: 'نمونه آزمایشگاهی (MVP)',
        description: 'پوشش پلیمری مقاوم در برابر دمای بالا و محیط‌های اسیدی ویژه صنایع نفت و گاز.',
        patent: 'ندارد'
      }
    ],
    entryDate: '1403/04/01',
    preIncubationEndDate: '1403/10/01',
    incubationEntryDate: '',
    threeYearEndDate: '',
    renewalDate: '',
    membershipStatus: 'پیش‌رشد',
    targetAudience: 'پالایشگاه‌ها، صنایع پتروشیمی و نیروگاه‌ها',
    investmentRaised: 'خیر',
    investmentAmount: '',
    revenueModel: 'فروش مواد اولیه پوشش‌دهی و اجرای پروژه',
    salesYear1: '',
    salesYear2: '',
    salesYear3: '',
    salesYear4: '',
    exitDate: '',
    exitResult: '',
    notes: 'تیم برگزیده Selection Day دوره مسیر',
    shortDesc: 'توسعه فرمولاسیون پوشش‌های نانوپلیمری مقاوم به خوردگی و حرارت برای تجهیزات صنایع نفت و انرژی.',
    logoUrl: '',
    isPublic: true,
    isFeatured: false,
    publishInvestment: false,
    publishSales: false,
    locationStatus: 'مستقر در فضای اشتراکی',
    history: []
  }
];

const DEFAULT_ACCESS_POLICIES = {
  ceoPersonal: 'admin_only',
  financialCodes: 'admin_only',
  salesData: 'conditional',
  investmentData: 'conditional',
  staffDetails: 'public',
  membershipDates: 'public'
};

const DB_FIELD_DEFINITIONS = [
  { key: 'rowNumber', label: 'ردیف', group: 'هویتی و ثبتی', aliases: ['ردیف', 'شماره ردیف'] },
  { key: 'status', label: 'وضعیت', group: 'هویتی و ثبتی', aliases: ['وضعیت', 'وضعیت فعلی'] },
  { key: 'level', label: 'سطح‌بندی', group: 'هویتی و ثبتی', aliases: ['سطح‌بندی', 'سطح بندی', 'سطح'] },
  { key: 'name', label: 'نام شرکت / هسته فناور', group: 'هویتی و ثبتی', required: true, aliases: ['نام شرکت', 'نام شرکت/هسته فناور', 'نام هسته'] },
  { key: 'nationalId', label: 'شناسه ملی', group: 'هویتی و ثبتی', aliases: ['شناسه ملی', 'شناسه ملی شرکت'] },
  { key: 'registrationNumber', label: 'شماره ثبت', group: 'هویتی و ثبتی', aliases: ['شماره ثبت'] },
  { key: 'companyType', label: 'نوع شرکت', group: 'هویتی و ثبتی', aliases: ['نوع شرکت', 'شخصیت حقوقی'] },
  { key: 'establishedDate', label: 'تاریخ تأسیس', group: 'هویتی و ثبتی', aliases: ['تاریخ تأسیس', 'تاریخ تاسیس'] },
  { key: 'ceoName', label: 'نام مدیرعامل', group: 'مدیرعامل', aliases: ['نام مدیرعامل', 'مدیرعامل'] },
  { key: 'ceoPhone', label: 'شماره تماس مدیرعامل', group: 'مدیرعامل', aliases: ['شماره تماس', 'موبایل مدیرعامل'] },
  { key: 'unitNumber', label: 'شماره واحد', group: 'استقرار', aliases: ['شماره واحد', 'واحد'] },
  { key: 'field', label: 'حوزه فعالیت', group: 'فناوری', aliases: ['حوزه فعالیت', 'حوزه فناوری'] },
  { key: 'knowledgeBased', label: 'دانش‌بنیان', group: 'فناوری', aliases: ['دانش‌بنیان', 'دانش بنیان'] },
  { key: 'totalStaff', label: 'تعداد کل نیروی انسانی', group: 'نیروی انسانی', aliases: ['تعداد کل نیروی انسانی', 'نیروی انسانی'] },
  { key: 'femaleStaff', label: 'تعداد بانوان', group: 'نیروی انسانی', aliases: ['تعداد بانوان', 'بانوان'] }
];

// ثابت‌های دبیرخانه الکترونیکی
const INCOMING_STATUSES = [
  'ثبت اولیه',
  'در انتظار ارجاع',
  'ارجاع‌شده',
  'در حال بررسی',
  'در انتظار پاسخ',
  'پاسخ داده‌شده',
  'مختومه',
  'بایگانی‌شده'
];

const REFERRAL_TYPES = [
  'جهت اقدام',
  'جهت بررسی',
  'جهت اطلاع',
  'جهت اظهارنظر',
  'جهت تهیه پاسخ',
  'جهت پیگیری'
];

const INITIAL_SECRETARIAT_STATE = {
  settings: {
    incomingPrefix: 'و-۱۴۰۵-',
    outgoingPrefix: 'ص-۱۴۰۵-',
    nextIncomingSeq: 103,
    nextOutgoingSeq: 202,
    orgHeader: 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان'
  },
  templates: [
    {
      id: 'tpl-1',
      title: 'نامه معرفی شرکت به صندوق نوآوری و شکوفایی',
      subject: 'معرفی شرکت عضو مرکز رشد جهت بهره‌مندی از تسهیلات',
      body: 'با سلام و احترام،\nبدینوسیله شرکت فناور مستقر در مرکز رشد فناوری نخبگان پارک فناوری پردیس جهت بررسی طرح و بهره‌مندی از حمایت‌های مالی و اعتباری به حضور معرفی می‌گردد.'
    },
    {
      id: 'tpl-2',
      title: 'ابلاغ مصوبه شورای فناوری مرکز رشد',
      subject: 'ابلاغ مصوبه تمدید / ارتقاء دوره استقرار',
      body: 'با سلام و احترام،\nپیرو جلسه شورای فناوری مرکز رشد فناوری نخبگان، بدینوسیله مصوبه مربوط به وضعیت استقرار آن شرکت جهت استحضار و اقدام مقتضی ابلاغ می‌گردد.'
    }
  ],
  letters: [
    {
      id: 'let-1',
      direction: 'incoming',
      indicatorNumber: 'و-۱۴۰۵-۱۰۱',
      senderLetterNumber: '۱۴۰۵/۲۴/۸۹۰',
      letterDate: '1405/01/12',
      receivedDate: '1405/01/13',
      senderType: 'حقوقی',
      senderName: 'دکتر کامران شریفی',
      senderOrg: 'معاونت فناوری پارک فناوری پردیس',
      subject: 'فراخوان ارزیابی سالانه شرکت‌های مستقر در مراکز رشد',
      summary: 'ارسال شاخص‌های ارزیابی عملکرد شرکت‌های دوره رشد و پیش‌رشد جهت تکمیل فرم‌های مربوطه.',
      priority: 'فوری',
      confidentiality: 'عادی',
      status: 'ارجاع‌شده',
      deadline: '1405/01/25',
      assignedTo: 'کارشناس ارزیابی',
      isDeleted: false,
      attachments: [],
      referrals: [
        {
          id: 'ref-1',
          fromUser: 'مسئول دبیرخانه',
          toUsers: ['کارشناس ارزیابی', 'مدیر مجموعه'],
          type: 'جهت اقدام',
          deadline: '1405/01/25',
          note: 'لطفاً به شرکت‌های مستقر اطلاع‌رسانی و مدارک جمع‌آوری شود.',
          date: '1405/01/13 10:15',
          response: ''
        }
      ],
      versions: []
    },
    {
      id: 'let-2',
      direction: 'outgoing',
      indicatorNumber: 'ص-۱۴۰۵-۲۰۱',
      letterDate: '1405/01/15',
      recipientOrg: 'صندوق پژوهش و فناوری پردیس',
      recipientPerson: 'مدیریت محترم عامل',
      subject: 'معرفی شرکت پارس هوش مصنوعی پردیس جهت دریافت ضمانت‌نامه',
      body: 'با سلام و احترام،\nبدینوسیله شرکت «پارس هوش مصنوعی پردیس» عضو فعال مرکز رشد فناوری نخبگان جهت بررسی پرونده و صدور ضمانت‌نامه شرکت در مناقصه معرفی می‌گردد.',
      signerName: 'دکتر حمیدرضا رضایی',
      signerTitle: 'رئیس مرکز رشد فناوری نخبگان',
      copies: 'واحد امور شرکت‌ها، بایگانی',
      confidentiality: 'عادی',
      status: 'ثبت نهایی و ارسال‌شده',
      isDraft: false,
      isDeleted: false,
      attachments: [],
      referrals: [],
      versions: [
        { version: 1, date: '1405/01/15 11:00', user: 'مسئول دبیرخانه', note: 'ثبت نهایی و تخصیص شماره اندیکاتور' }
      ]
    }
  ],
  auditLogs: [
    { id: 'al-1', date: '1405/01/13 10:15', user: 'مسئول دبیرخانه', action: 'ثبت نامه وارده و-۱۴۰۵-۱۰۱' },
    { id: 'al-2', date: '1405/01/15 11:00', user: 'مسئول دبیرخانه', action: 'ثبت نهایی نامه صادره ص-۱۴۰۵-۲۰۱' }
  ]
};

// ثابت‌های ماژول اموال و تجهیزات
const DEFAULT_ASSET_ITEMS = [
  'میز',
  'صندلی',
  'کتابخانه',
  'سطل زباله',
  'تخته وایت‌برد',
  'کلید واحد',
  'سایر تجهیزات'
];

const computeAssetQuantities = (item) => {
  let initialQty = 0;
  let addedQty = 0;
  let returnedQty = 0;
  (item.events || []).forEach((ev) => {
    const delta = Number(ev.quantityDelta) || 0;
    if (ev.type === 'تحویل اولیه') {
      initialQty += delta;
    } else if (delta > 0) {
      addedQty += delta;
    } else if (delta < 0) {
      returnedQty += Math.abs(delta);
    }
  });
  const currentQty = Math.max(0, initialQty + addedQty - returnedQty);
  return { initialQty, addedQty, returnedQty, currentQty };
};

const INITIAL_ASSETS_STATE = {
  items: [
    {
      id: 'ast-1',
      companyId: 'comp-1',
      companyName: 'پارس هوش مصنوعی پردیس',
      itemName: 'میز',
      assetCode: 'PRK-1041',
      category: 'مبلمان اداری',
      physicalCondition: 'سالم و نو',
      notes: 'میز کارشناسی MDF به همراه کشو',
      deliveryDate: '1400/02/05',
      deliveredBy: 'کارشناس اموال مرکز رشد',
      receivedBy: 'دکتر امیرحسین کاظمی',
      confirmationStatus: 'نهایی‌شده',
      companyConfirmation: {
        confirmedBy: 'دکتر امیرحسین کاظمی',
        date: '1400/02/06 11:30',
        discrepancyNote: ''
      },
      events: [
        {
          id: 'ev-1',
          type: 'تحویل اولیه',
          quantityDelta: 4,
          date: '1400/02/05',
          user: 'کارشناس اموال',
          reason: 'تحویل تجهیز اولیه واحد ۳۰۴'
        },
        {
          id: 'ev-2',
          type: 'تحویل تکمیلی',
          quantityDelta: 2,
          date: '1402/04/10',
          user: 'کارشناس اموال',
          reason: 'افزایش نیروی انسانی شرکت'
        }
      ]
    },
    {
      id: 'ast-2',
      companyId: 'comp-1',
      companyName: 'پارس هوش مصنوعی پردیس',
      itemName: 'صندلی',
      assetCode: 'PRK-1042',
      category: 'مبلمان اداری',
      physicalCondition: 'سالم',
      notes: 'صندلی چرخ‌دار کارشناسی',
      deliveryDate: '1400/02/05',
      deliveredBy: 'کارشناس اموال مرکز رشد',
      receivedBy: 'دکتر امیرحسین کاظمی',
      confirmationStatus: 'نهایی‌شده',
      companyConfirmation: {
        confirmedBy: 'دکتر امیرحسین کاظمی',
        date: '1400/02/06 11:30',
        discrepancyNote: ''
      },
      events: [
        {
          id: 'ev-3',
          type: 'تحویل اولیه',
          quantityDelta: 6,
          date: '1400/02/05',
          user: 'کارشناس اموال',
          reason: 'تحویل اولیه'
        },
        {
          id: 'ev-4',
          type: 'استرداد به مرکز رشد',
          quantityDelta: -1,
          date: '1403/03/12',
          user: 'کارشناس اموال',
          reason: 'استهلاک جک صندلی و عودت به انبار'
        }
      ]
    },
    {
      id: 'ast-3',
      companyId: 'comp-2',
      companyName: 'زیست‌فناوران نوین ژنوم',
      itemName: 'تخته وایت‌برد',
      assetCode: 'PRK-2015',
      category: 'تجهیزات آموزشی و جلسات',
      physicalCondition: 'سالم',
      notes: 'وایت‌برد مغناطیسی ۱۰۰ در ۱۵۰',
      deliveryDate: '1405/01/14',
      deliveredBy: 'کارشناس اموال مرکز رشد',
      receivedBy: 'دکتر مریم احمدی',
      confirmationStatus: 'ارسال‌شده برای تأیید شرکت',
      companyConfirmation: null,
      events: [
        {
          id: 'ev-5',
          type: 'تحویل اولیه',
          quantityDelta: 1,
          date: '1405/01/14',
          user: 'کارشناس اموال',
          reason: 'تجهیز اتاق جلسات واحد ۱۰۸'
        }
      ]
    }
  ]
};

// ثابت‌های ماژول تبدیل وضعیت شرکت
const INITIAL_UPGRADE_STATE = {
  requests: [
    {
      id: 'upg-1',
      companyId: 'comp-4',
      companyName: 'هسته فناور نانوپوشش آریا',
      status: 'در حال تکمیل',
      startedAt: '1405/01/10 09:00',
      submittedAt: '',
      assignedExpert: 'مهندس حسینی',
      internalNote: '',
      sectionRemarks: {
        section1: '',
        section2: '',
        section3: '',
        section4: '',
        section5: ''
      },
      section1: {
        fullCompanyName: 'فناوران نانوپوشش آریا (سهامی خاص)',
        legalType: 'سهامی خاص',
        nationalId: '14011998877',
        registrationNumber: '615420',
        registrationDate: '1403/01/20',
        headquartersAddress: 'پارک فناوری پردیس، ساختمان نخبگان، واحد اشتراکی ۱۲',
        ceoName: 'مهندس محمدجواد کریمی',
        phone: '09351234567',
        email: 'aria.nanocoat@gmail.com',
        shareholders: [
          { name: 'محمدجواد کریمی', sharePercent: 55, role: 'مدیرعامل و عضو هیئت‌مدیره' },
          { name: 'سارا محمدی', sharePercent: 45, role: 'رئیس هیئت‌مدیره' }
        ],
        attachments: {
          establishmentAd: null,
          latestChanges: null,
          statute: null,
          otherDocs: null
        }
      },
      section2: {
        reportText:
          'ایده محوری شرکت تولید پوشش‌های نانوپلیمری مقاوم در برابر خوردگی اسیدی و حرارت بالا برای مبدل‌های حرارتی صنایع نفت و گاز است.\nدر طول دوره پیش‌رشد، فرمولاسیون آزمایشگاهی بهینه شد و تست‌های خوردگی ASTM B117 با موفقیت در آزمایشگاه مرجع انجام گردید.',
        attachments: []
      },
      section3: {
        customerSegments: 'پالایشگاه‌ها، مجتمع‌های پتروشیمی و نیروگاه‌های حرارتی',
        valuePropositions: 'افزایش ۳ برابری عمر مبدل‌های حرارتی و کاهش هزینه‌های تعمیرات اساسی',
        channels: 'فروش مستقیم سازمانی (B2B) و پیمانکاران تعمیرات و نگهداری صنایع',
        customerRelationships: 'مشاوره فنی اختصاصی، اجرای پایلوت و پشتیبانی پس از اجرا',
        revenueStreams: 'فروش پوشش نانوپلیمری و اجرای قراردادهای پوشش‌دهی صنعتی',
        keyResources: 'دانش فنی فرمولاسیون، تیم متخصص مهندسی مواد، آزمایشگاه تست خوردگی',
        keyActivities: 'تولید نیمه‌صنعتی، کنترل کیفیت، بازاریابی فنی و اجرای پایلوت',
        keyPartners: 'پارک فناوری پردیس، آزمایشگاه‌های مرجع نانو، پیمانکاران نفت و گاز',
        costStructure: 'مواد اولیه پلیمری و نانوذرات، حقوق نیروی متخصص، هزینه‌های آزمون و استاندارد',
        attachments: []
      },
      section4: {
        overview: 'ورود به بازار صنایع پتروشیمی کشور و انعقاد ۳ قرارداد پایلوت صنعتی در سال اول دوره رشد.',
        targetMarket: 'صنایع نفت، گاز، پتروشیمی و نیروگاهی کشور',
        targetCustomers: 'واحدهای مهندسی خوردگی و تعمیرات پالایشگاه‌ها',
        goToMarketStrategy: 'اجرای پایلوت رایگان روی یک مبدل نمونه و اخذ تاییدیه فنی بهره‌بردار',
        marketingPlan: 'حضور در نمایشگاه بین‌المللی نفت و گاز و برگزاری جلسات فنی B2B',
        productDevPlan: 'اخذ تاییدیه نانومقیاس و ارتقاء ظرفیت تولید به ۵ تن در ماه',
        financialPlan: 'تأمین مالی از محل پیش‌دریافت قراردادها و تسهیلات صندوق پژوهش و فناوری',
        industrialPartners: 'شرکت ملی پالایش و پخش فرآورده‌های نفتی',
        kpis: 'انعقاد حداقل ۳ قرارداد تجاری، اخذ گواهی نانومقیاس، فروش ۵ میلیارد تومان',
        forecastSales: '۵,۰۰۰,۰۰۰,۰۰۰',
        forecastCustomers: '۶',
        forecastContracts: '۴',
        quarters: {
          q1: { actions: 'اخذ تاییدیه نانومقیاس و تکمیل خط تولید نیمه‌صنعتی', output: 'گواهی نانومقیاس', kpi: 'تولید ۵۰۰ کیلوگرم محصول' },
          q2: { actions: 'اجرای ۲ پایلوت صنعتی در پالایشگاه', output: 'گزارش عملکرد پایلوت', kpi: 'تایید فنی کارفرما' },
          q3: { actions: 'انعقاد قراردادهای فروش تجاری اول و دوم', output: 'قرارداد رسمی فروش', kpi: 'فروش ۲ میلیارد تومان' },
          q4: { actions: 'توسعه تیم فروش و عقد قرارداد سوم', output: 'گزارش عملکرد سالانه', kpi: 'فروش تجمعی ۵ میلیارد تومان' }
        }
      },
      section5: {
        contracts: [
          {
            id: 'cnt-1',
            productName: 'پوشش نانوپلیمری AriaShield-200',
            clientOrg: 'پتروشیمی پردیس',
            clientType: 'صنعتی / خصوصی',
            subject: 'اجرای پایلوت پوشش ضدخوردگی مبدل حرارتی واحد آمونیاک',
            contractAmount: 850000000,
            contractDate: '1404/11/15',
            duration: '۴ ماه',
            status: 'در حال اجرا',
            realizedSales: 425000000,
            notes: 'قسط اول پیش‌پرداخت دریافت شده است.',
            contractFile: null,
            invoiceFile: null
          }
        ]
      },
      history: [
        {
          id: 'uh-1',
          date: '1405/01/10 09:00',
          user: 'مهندس محمدجواد کریمی',
          action: 'ایجاد و شروع تکمیل پرونده درخواست تبدیل وضعیت از پیش‌رشد به رشد'
        }
      ]
    }
  ]
};

// ============================================================================
// ۲-د. داده‌ها و ثابت‌های ماژول «مدیریت نیروی انسانی شرکت‌ها»
// ============================================================================
const HR_ORG_UNITS = ['مدیریت', 'فنی و مهندسی', 'تحقیق و توسعه (R&D)', 'فروش و توسعه بازار', 'بازاریابی و محتوا', 'مالی و حسابداری', 'اداری و پشتیبانی'];
const HR_COOPERATION_TYPES = ['تمام‌وقت', 'پاره‌وقت', 'پروژه‌ای', 'مشاور', 'کارآموز', 'پیمانکاری', 'سایر'];
const HR_CONTRACT_TYPES = ['قرارداد استخدامی', 'قرارداد کار معین', 'قرارداد پروژه‌ای', 'قرارداد مشاوره', 'قرارداد پیمانکاری', 'بدون قرارداد رسمی', 'سایر'];
const HR_COOPERATION_STATUSES = ['فعال', 'غیرفعال', 'تعلیق همکاری', 'خاتمه همکاری'];
const HR_ATTENDANCE_MODES = ['حضوری در محل شرکت', 'دورکار / مجازی', 'ترکیبی (حضوری و مجازی)', 'فعالیت خارج از مرکز رشد'];
const HR_WORK_LOCATIONS = ['واحد اختصاصی شرکت در مرکز رشد', 'فضای کار اشتراکی', 'خارج از مرکز رشد', 'سایر'];

const INITIAL_HR_STATE = {
  companyVehicles: [
    {
      id: 'cveh-1',
      companyId: 'comp-1',
      companyName: 'پارس هوش مصنوعی پردیس',
      vehicleType: 'سواری',
      brandModel: 'پژو ۲۰۷ اتوماتیک سفید',
      color: 'سفید',
      plateNumber: '۴۴ ب ۳۲۸ ایران ۱۱',
      ownerType: 'متعلق به شرکت',
      notes: 'خودرو سازمانی جهت تردد تیم فنی و جلسات بیرون از پارک'
    }
  ],
  personnel: [
    {
      id: 'hr-101',
      companyId: 'comp-1',
      companyName: 'پارس هوش مصنوعی پردیس',
      reviewStatus: 'تأییدشده',
      returnNote: '',
      firstName: 'سارا',
      lastName: 'رضایی',
      fatherName: 'محمد',
      nationalId: '0074561239',
      birthDate: '1369/04/18',
      mobile: '09123451122',
      email: 's.rezaei@pars-ai.ir',
      gender: 'زن',
      avatarUrl: '',
      jobTitle: 'مدیر فنی و هوش مصنوعی',
      orgUnit: 'فنی و مهندسی',
      specialty: 'پردازش زبان طبیعی و یادگیری عمیق',
      degree: 'دکتری تخصصی',
      major: 'مهندسی کامپیوتر - هوش مصنوعی',
      experienceYears: 7,
      startDate: '1400/03/01',
      cooperationType: 'تمام‌وقت',
      contractType: 'قرارداد استخدامی',
      contractDuration: 'یک‌ساله',
      contractStartDate: '1405/01/01',
      contractEndDate: '1405/12/29',
      cooperationStatus: 'فعال',
      exitDate: '',
      exitReason: '',
      attendanceMode: 'حضوری در محل شرکت',
      weeklyPresenceDays: 5,
      workingHours: '۰۸:۳۰ الی ۱۷:۰۰',
      presenceDaysOfWeek: 'شنبه تا چهارشنبه',
      activityNotes: 'حضور کامل در واحد ۳۰۴ ساختمان نخبگان',
      workLocation: 'واحد اختصاصی شرکت در مرکز رشد',
      hasVehicle: true,
      vehicles: [
        {
          id: 'veh-1',
          vehicleType: 'سواری',
          brandModel: 'مزدا ۳ نیو',
          color: 'خاکستری',
          plateNumber: '۲۲ ج ۵۱۲ ایران ۴۴',
          ownerType: 'شخصی',
          notes: ''
        }
      ],
      sharedCompanyVehicleIds: ['cveh-1'],
      documents: {
        contractFile: null,
        resumeFile: null,
        educationFile: null,
        nationalCardFile: null,
        otherFile: null
      },
      history: [
        { id: 'hrh-1', date: '1405/01/10 09:30', user: 'دکتر امیرحسین کاظمی', action: 'ثبت پرونده پرسنلی و ارسال به مرکز رشد' },
        { id: 'hrh-2', date: '1405/01/12 14:00', user: 'مهندس حسینی (کارشناس مرکز رشد)', action: 'بررسی و تأیید نهایی اطلاعات پرسنل' }
      ]
    },
    {
      id: 'hr-102',
      companyId: 'comp-1',
      companyName: 'پارس هوش مصنوعی پردیس',
      reviewStatus: 'ارسال‌شده',
      returnNote: '',
      firstName: 'امیررضا',
      lastName: 'نیک‌بخت',
      fatherName: 'حسین',
      nationalId: '0018923456',
      birthDate: '1374/09/12',
      mobile: '09358899001',
      email: 'a.nikbakht@pars-ai.ir',
      gender: 'مرد',
      avatarUrl: '',
      jobTitle: 'توسعه‌دهنده ارشد نرم‌افزار',
      orgUnit: 'تحقیق و توسعه (R&D)',
      specialty: 'معماری میکروسرویس و پایتون',
      degree: 'کارشناسی ارشد',
      major: 'مهندسی نرم‌افزار',
      experienceYears: 4,
      startDate: '1402/06/15',
      cooperationType: 'تمام‌وقت',
      contractType: 'قرارداد کار معین',
      contractDuration: '۶ ماهه',
      contractStartDate: '1404/11/01',
      contractEndDate: '1405/04/31',
      cooperationStatus: 'فعال',
      exitDate: '',
      exitReason: '',
      attendanceMode: 'ترکیبی (حضوری و مجازی)',
      weeklyPresenceDays: 3,
      workingHours: '۰۹:۰۰ الی ۱۷:۳۰',
      presenceDaysOfWeek: 'شنبه، دوشنبه، چهارشنبه',
      activityNotes: 'سایر روزها به‌صورت دورکار فعالیت دارد.',
      workLocation: 'واحد اختصاصی شرکت در مرکز رشد',
      hasVehicle: false,
      vehicles: [],
      sharedCompanyVehicleIds: ['cveh-1'],
      documents: {
        contractFile: null,
        resumeFile: null,
        educationFile: null,
        nationalCardFile: null,
        otherFile: null
      },
      history: [
        { id: 'hrh-3', date: '1405/01/16 11:20', user: 'دکتر امیرحسین کاظمی', action: 'ثبت اطلاعات پرسنل جدید و ارسال برای تأیید مرکز رشد' }
      ]
    },
    {
      id: 'hr-103',
      companyId: 'comp-2',
      companyName: 'زیست‌فناوران نوین ژنوم',
      reviewStatus: 'تأییدشده',
      returnNote: '',
      firstName: 'نیلوفر',
      lastName: 'فرهادی',
      fatherName: 'علی',
      nationalId: '0081239876',
      birthDate: '1371/02/25',
      mobile: '09126543210',
      email: 'n.farhadi@genome-bio.ir',
      gender: 'زن',
      avatarUrl: '',
      jobTitle: 'مسئول فنی آزمایشگاه مولکولی',
      orgUnit: 'تحقیق و توسعه (R&D)',
      specialty: 'ژنتیک مولکولی و PCR',
      degree: 'کارشناسی ارشد',
      major: 'زیست‌فناوری پزشکی',
      experienceYears: 5,
      startDate: '1401/07/01',
      cooperationType: 'تمام‌وقت',
      contractType: 'قرارداد استخدامی',
      contractDuration: 'یک‌ساله',
      contractStartDate: '1405/01/01',
      contractEndDate: '1405/12/29',
      cooperationStatus: 'فعال',
      exitDate: '',
      exitReason: '',
      attendanceMode: 'حضوری در محل شرکت',
      weeklyPresenceDays: 5,
      workingHours: '۰۸:۰۰ الی ۱۶:۳۰',
      presenceDaysOfWeek: 'شنبه تا چهارشنبه',
      activityNotes: 'استقرار ثابت در آزمایشگاه زیست واحد ۱۰۸',
      workLocation: 'واحد اختصاصی شرکت در مرکز رشد',
      hasVehicle: true,
      vehicles: [
        {
          id: 'veh-2',
          vehicleType: 'سواری',
          brandModel: 'تیبا ۲ هاچ‌بک',
          color: 'سفید',
          plateNumber: '۷۷ د ۸۱۴ ایران ۶۶',
          ownerType: 'شخصی',
          notes: ''
        }
      ],
      sharedCompanyVehicleIds: [],
      documents: {
        contractFile: null,
        resumeFile: null,
        educationFile: null,
        nationalCardFile: null,
        otherFile: null
      },
      history: [
        { id: 'hrh-4', date: '1405/01/14 10:00', user: 'دکتر مریم احمدی', action: 'ثبت پرونده پرسنلی' }
      ]
    }
  ]
};

// ============================================================================
// ۳. کامپوننت آواتار شرکت
// ============================================================================
const CompanyAvatar = ({ company, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-20 h-20 text-2xl'
  };

  if (company?.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt={company.name}
        className={`${sizeClasses[size]} rounded-xl object-contain bg-white border border-slate-200 p-1.5 shadow-sm shrink-0`}
      />
    );
  }

  const initials =
    (company?.name || 'ش')
      .replace(/شرکت|هسته فناور|مهندسی|دانش‌بنیان/g, '')
      .trim()
      .slice(0, 2) || 'نخ';

  return (
    <div
      className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br from-[#0f294a] to-[#1d4ed8] text-white font-bold flex items-center justify-center shadow-sm shrink-0 border border-blue-900/20`}
    >
      {initials}
    </div>
  );
};

// ============================================================================
// ۴. کامپوننت اصلی اپلیکیشن با منوی عمودی سمت راست (Right Sidebar Navigation)
// ============================================================================
export default function App() {
  const [companies, setCompanies] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_companies_v1');
      return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
    } catch {
      return INITIAL_COMPANIES;
    }
  });

  const [accessPolicies, setAccessPolicies] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_access_policies_v1');
      return saved ? JSON.parse(saved) : DEFAULT_ACCESS_POLICIES;
    } catch {
      return DEFAULT_ACCESS_POLICIES;
    }
  });

  const [secretariat, setSecretariat] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_secretariat_v1');
      return saved ? JSON.parse(saved) : INITIAL_SECRETARIAT_STATE;
    } catch {
      return INITIAL_SECRETARIAT_STATE;
    }
  });

  const [assetsState, setAssetsState] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_assets_v1');
      return saved ? JSON.parse(saved) : INITIAL_ASSETS_STATE;
    } catch {
      return INITIAL_ASSETS_STATE;
    }
  });

  const [upgradeState, setUpgradeState] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_upgrade_requests_v1');
      return saved ? JSON.parse(saved) : INITIAL_UPGRADE_STATE;
    } catch {
      return INITIAL_UPGRADE_STATE;
    }
  });

  const [hrState, setHrState] = useState(() => {
    try {
      const saved = localStorage.getItem('nokhbegan_hr_v1');
      return saved ? JSON.parse(saved) : INITIAL_HR_STATE;
    } catch {
      return INITIAL_HR_STATE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_companies_v1', JSON.stringify(companies));
    } catch (e) {
      console.error('Companies storage error', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_access_policies_v1', JSON.stringify(accessPolicies));
    } catch (e) {
      console.error('Policies storage error', e);
    }
  }, [accessPolicies]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_secretariat_v1', JSON.stringify(secretariat));
    } catch (e) {
      console.error('Secretariat storage error', e);
    }
  }, [secretariat]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_assets_v1', JSON.stringify(assetsState));
    } catch (e) {
      console.error('Assets storage error', e);
    }
  }, [assetsState]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_upgrade_requests_v1', JSON.stringify(upgradeState));
    } catch (e) {
      console.error('Upgrade storage error', e);
    }
  }, [upgradeState]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_hr_v1', JSON.stringify(hrState));
    } catch (e) {
      console.error('HR storage error', e);
    }
  }, [hrState]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    portal: true,
    hr: true,
    upgrade: true,
    secretariat: true,
    assets: true
  });

  const [activeSection, setActiveSection] = useState('public_home');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [globalQuickSearch, setGlobalQuickSearch] = useState('');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [toast, setToast] = useState(null);

  // نقش کاربری فعال در سامانه (قابل تعویض سریع در پایین سایدبار برای تست دسترسی‌ها)
  const [adminUser, setAdminUser] = useState({
    username: 'admin',
    role: 'admin',
    secretariatRole: 'system_admin',
    name: 'مدیر سیستم مرکز رشد',
    companyId: 'comp-1'
  });

  useEffect(() => {
    if (!window.XLSX && !document.getElementById('sheetjs-cdn-script')) {
      const script = document.createElement('script');
      script.id = 'sheetjs-cdn-script';
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNavigate = (sectionId) => {
    if (sectionId === 'comp_form') {
      setEditingCompany(null);
    }
    setActiveSection(sectionId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // آمارهای تجمیعی شرکت‌ها
  const stats = useMemo(() => {
    const publicList = companies.filter((c) => c.isPublic);
    const activeCount = companies.filter((c) => c.status && c.status.includes('فعال')).length;
    const exitedCount = companies.filter((c) => c.status && c.status.includes('خارج')).length;
    const kbCount = companies.filter(
      (c) => c.knowledgeBased && c.knowledgeBased.includes('دانش‌بنیان') && !c.knowledgeBased.includes('خیر')
    ).length;
    const totalProducts = companies.reduce(
      (sum, c) => sum + (Number(c.productCount) || (c.products?.length || 0)),
      0
    );
    const totalStaff = companies.reduce((sum, c) => sum + (Number(c.totalStaff) || 0), 0);
    const fieldsSet = new Set(companies.map((c) => c.field).filter(Boolean));
    const byField = {};
    companies.forEach((c) => {
      const f = c.field || 'سایر حوزه‌ها';
      byField[f] = (byField[f] || 0) + 1;
    });
    const expiringCompanies = companies.filter(
      (c) =>
        (c.membershipStatus && (c.membershipStatus.includes('آماده خروج') || c.membershipStatus.includes('رو به اتمام'))) ||
        (c.threeYearEndDate && c.threeYearEndDate.startsWith('1403'))
    );
    return {
      total: companies.length,
      publicTotal: publicList.length,
      activeCount,
      exitedCount,
      kbCount,
      totalProducts,
      totalStaff,
      fieldsCount: fieldsSet.size,
      byField,
      expiringCompanies
    };
  }, [companies]);

  // آمار دبیرخانه
  const secStats = useMemo(() => {
    const activeLetters = secretariat.letters.filter((l) => !l.isDeleted && !l.isDraft);
    const incoming = activeLetters.filter((l) => l.direction === 'incoming').length;
    const outgoing = activeLetters.filter((l) => l.direction === 'outgoing').length;
    const pending = activeLetters.filter((l) => ['ثبت اولیه', 'در انتظار ارجاع', 'در انتظار پاسخ'].includes(l.status)).length;
    const referred = activeLetters.filter((l) => l.status === 'ارجاع‌شده').length;
    const withDeadline = activeLetters.filter((l) => l.deadline && l.status !== 'مختومه' && l.status !== 'بایگانی‌شده').length;
    const archived = activeLetters.filter((l) => l.status === 'بایگانی‌شده' || l.status === 'مختومه').length;
    const drafts = secretariat.letters.filter((l) => !l.isDeleted && l.isDraft).length;
    const myTasks = activeLetters.filter((l) =>
      (l.referrals || []).some((r) => r.toUsers?.includes(adminUser.name) && !r.response)
    ).length;
    return { incoming, outgoing, pending, referred, withDeadline, archived, drafts, myTasks };
  }, [secretariat.letters, adminUser.name]);

  // آمار اموال
  const assetStats = useMemo(() => {
    const items = assetsState.items || [];
    let totalRegistered = 0;
    let totalDelivered = 0;
    let pendingConfirm = 0;
    let totalReturned = 0;
    let discrepancyCount = 0;
    const companySet = new Set();

    items.forEach((it) => {
      const q = computeAssetQuantities(it);
      totalRegistered += q.initialQty + q.addedQty;
      totalDelivered += q.currentQty;
      totalReturned += q.returnedQty;
      if (it.confirmationStatus === 'ارسال‌شده برای تأیید شرکت') pendingConfirm++;
      if (it.confirmationStatus === 'دارای مغایرت') discrepancyCount++;
      if (q.currentQty > 0) companySet.add(it.companyId);
    });

    return {
      totalRegistered,
      totalDelivered,
      pendingConfirm,
      totalReturned,
      discrepancyCount,
      companiesWithAssets: companySet.size
    };
  }, [assetsState.items]);

  // آمار تبدیل وضعیت
  const upgradeStats = useMemo(() => {
    const reqs = upgradeState.requests || [];
    const pendingReview = reqs.filter((r) =>
      ['ارسال‌شده به مرکز رشد', 'در حال بررسی', 'ارسال مجدد'].includes(r.status)
    ).length;
    const returnedCount = reqs.filter((r) => r.status === 'عودت‌شده برای اصلاح').length;
    const approvedCount = reqs.filter((r) => r.status === 'تأییدشده و تبدیل وضعیت به رشد').length;
    return { total: reqs.length, pendingReview, returnedCount, approvedCount };
  }, [upgradeState.requests]);

  // آمار نیروی انسانی
  const hrStats = useMemo(() => {
    const list = hrState.personnel || [];
    const activeList = list.filter((p) => p.cooperationStatus === 'فعال');
    const pendingReview = list.filter((p) => p.reviewStatus === 'ارسال‌شده').length;
    const returnedCount = list.filter((p) => p.reviewStatus === 'نیازمند اصلاح').length;
    return {
      total: list.length,
      active: activeList.length,
      pendingReview,
      returnedCount
    };
  }, [hrState.personnel]);

  // همگام‌سازی خودکار آمار نیروی انسانی شرکت با جدول اصلی شرکت‌ها
  const syncCompanyStaffCount = (companyId, nextPersonnelList) => {
    const companyActive = nextPersonnelList.filter(
      (p) => p.companyId === companyId && p.cooperationStatus === 'فعال'
    );
    if (companyActive.length === 0) return;
    const femaleCount = companyActive.filter((p) => p.gender === 'زن').length;
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === companyId
          ? { ...c, totalStaff: companyActive.length, femaleStaff: femaleCount }
          : c
      )
    );
  };

  // عملیات نیروی انسانی
  const handleSavePersonnel = (personPayload, sendForReview = true) => {
    const nowStr = getNowJalaliDateTime();
    setHrState((prev) => {
      const exists = prev.personnel.some((p) => p.id === personPayload.id);
      const nextReviewStatus = sendForReview
        ? 'ارسال‌شده'
        : personPayload.reviewStatus || 'پیش‌نویس';

      const newHistoryItem = {
        id: 'hrh-' + Date.now(),
        date: nowStr,
        user: adminUser?.name || 'نماینده شرکت',
        action: exists
          ? sendForReview
            ? 'ویرایش اطلاعات و ارسال جهت بررسی مرکز رشد'
            : 'ذخیره تغییرات در پیش‌نویس'
          : sendForReview
          ? 'ثبت پرونده پرسنلی جدید و ارسال به مرکز رشد'
          : 'ثبت اولیه پیش‌نویس پرسنل'
      };

      const savedPerson = {
        ...personPayload,
        id: personPayload.id || 'hr-' + Date.now(),
        reviewStatus: nextReviewStatus,
        returnNote: sendForReview ? '' : personPayload.returnNote,
        history: [...(personPayload.history || []), newHistoryItem]
      };

      const nextPersonnel = exists
        ? prev.personnel.map((p) => (p.id === savedPerson.id ? savedPerson : p))
        : [savedPerson, ...prev.personnel];

      syncCompanyStaffCount(savedPerson.companyId, nextPersonnel);
      return { ...prev, personnel: nextPersonnel };
    });

    showToast(
      sendForReview
        ? 'اطلاعات پرسنل با موفقیت ثبت و به کارتابل مرکز رشد ارسال شد.'
        : 'اطلاعات پرسنل به‌صورت پیش‌نویس ذخیره شد.'
    );
  };

  const handlePersonnelStatusTransition = (personId, actionType, payload) => {
    const nowStr = getNowJalaliDateTime();
    setHrState((prev) => {
      let targetCompanyId = null;
      const nextPersonnel = prev.personnel.map((p) => {
        if (p.id !== personId) return p;
        targetCompanyId = p.companyId;
        if (actionType === 'exit') {
          return {
            ...p,
            cooperationStatus: 'خاتمه همکاری',
            exitDate: payload.exitDate || getTodayJalali(),
            exitReason: payload.exitReason || '',
            history: [
              ...(p.history || []),
              {
                id: 'hrh-' + Date.now(),
                date: nowStr,
                user: adminUser?.name || 'نماینده شرکت',
                action: `ثبت خاتمه همکاری در تاریخ ${toPersianDigits(payload.exitDate || getTodayJalali())}${
                  payload.exitReason ? ` — علت: ${payload.exitReason}` : ''
                }`
              }
            ]
          };
        }
        return {
          ...p,
          cooperationStatus: 'فعال',
          startDate: payload.newStartDate || getTodayJalali(),
          contractType: payload.contractType || p.contractType,
          contractStartDate: payload.newStartDate || getTodayJalali(),
          contractEndDate: payload.contractEndDate || '',
          exitDate: '',
          exitReason: '',
          reviewStatus: 'ارسال‌شده',
          history: [
            ...(p.history || []),
            {
              id: 'hrh-' + Date.now(),
              date: nowStr,
              user: adminUser?.name || 'نماینده شرکت',
              action: `ثبت دوره همکاری جدید از تاریخ ${toPersianDigits(payload.newStartDate || getTodayJalali())}`
            }
          ]
        };
      });

      if (targetCompanyId) syncCompanyStaffCount(targetCompanyId, nextPersonnel);
      return { ...prev, personnel: nextPersonnel };
    });

    showToast(
      actionType === 'exit'
        ? 'خاتمه همکاری فرد با حفظ کامل سوابق ثبت شد.'
        : 'دوره همکاری جدید برای فرد ثبت و فعال شد.'
    );
  };

  const handleCenterReviewPersonnel = (personId, decision, note = '') => {
    const nowStr = getNowJalaliDateTime();
    setHrState((prev) => ({
      ...prev,
      personnel: prev.personnel.map((p) => {
        if (p.id !== personId) return p;
        const isApproved = decision === 'approve';
        return {
          ...p,
          reviewStatus: isApproved ? 'تأییدشده' : 'نیازمند اصلاح',
          returnNote: isApproved ? '' : note,
          history: [
            ...(p.history || []),
            {
              id: 'hrh-' + Date.now(),
              date: nowStr,
              user: adminUser?.name || 'کارشناس مرکز رشد',
              action: isApproved
                ? 'تأیید اطلاعات پرسنلی توسط کارشناس مرکز رشد'
                : `عودت پرونده پرسنلی برای اصلاح — توضیح: ${note}`
            }
          ]
        };
      })
    }));
    showToast(
      decision === 'approve'
        ? 'اطلاعات فرد تأیید نهایی شد.'
        : 'درخواست اصلاح به کارتابل شرکت عودت داده شد.'
    );
  };

  // عملیات تبدیل وضعیت شرکت
  const handleSaveUpgradeRequest = (updatedReq, submitToCenter = false) => {
    const nowStr = getNowJalaliDateTime();
    setUpgradeState((prev) => {
      const exists = prev.requests.some((r) => r.id === updatedReq.id);
      const nextStatus = submitToCenter
        ? updatedReq.status === 'عودت‌شده برای اصلاح'
          ? 'ارسال مجدد'
          : 'ارسال‌شده به مرکز رشد'
        : updatedReq.status === 'شروع‌نشده'
        ? 'در حال تکمیل'
        : updatedReq.status;

      const historyEntry = {
        id: 'uh-' + Date.now(),
        date: nowStr,
        user: adminUser.name,
        action: submitToCenter
          ? 'تأیید نهایی و ارسال درخواست تبدیل وضعیت به مرکز رشد'
          : 'ذخیره پیش‌نویس اطلاعات درخواست تبدیل وضعیت'
      };

      const nextReq = {
        ...updatedReq,
        status: nextStatus,
        submittedAt: submitToCenter ? nowStr : updatedReq.submittedAt,
        history: [...(updatedReq.history || []), historyEntry]
      };

      return {
        ...prev,
        requests: exists
          ? prev.requests.map((r) => (r.id === nextReq.id ? nextReq : r))
          : [nextReq, ...prev.requests]
      };
    });

    showToast(
      submitToCenter
        ? 'درخواست تبدیل وضعیت نهایی شد و به کارتابل کارشناسان مرکز رشد ارسال گردید.'
        : 'اطلاعات درخواست به‌صورت پیش‌نویس ذخیره شد.'
    );
  };

  const handleReturnUpgradeRequest = (reqId, sectionRemarks, internalNote) => {
    const nowStr = getNowJalaliDateTime();
    setUpgradeState((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          status: 'عودت‌شده برای اصلاح',
          sectionRemarks,
          internalNote,
          history: [
            ...(r.history || []),
            {
              id: 'uh-' + Date.now(),
              date: nowStr,
              user: adminUser.name,
              action: 'عودت درخواست به شرکت جهت اصلاح و تکمیل نواقص'
            }
          ]
        };
      })
    }));
    showToast('درخواست با درج موارد اصلاحی به کارتابل شرکت عودت داده شد.');
  };

  const handleApproveUpgradeRequest = (reqId, internalNote) => {
    const nowStr = getNowJalaliDateTime();
    const today = getTodayJalali();
    let targetCompanyId = null;

    setUpgradeState((prev) => ({
      ...prev,
      requests: prev.requests.map((r) => {
        if (r.id !== reqId) return r;
        targetCompanyId = r.companyId;
        return {
          ...r,
          status: 'تأییدشده و تبدیل وضعیت به رشد',
          internalNote,
          approvedAt: nowStr,
          history: [
            ...(r.history || []),
            {
              id: 'uh-' + Date.now(),
              date: nowStr,
              user: adminUser.name,
              action: 'تأیید نهایی درخواست و ارتقاء وضعیت شرکت از پیش‌رشد به رشد'
            }
          ]
        };
      })
    }));

    if (targetCompanyId) {
      setCompanies((prev) =>
        prev.map((c) => {
          if (c.id !== targetCompanyId) return c;
          return {
            ...c,
            level: 'سطح ۲ (دوره رشد)',
            membershipStatus: 'دوره رشد',
            incubationEntryDate: today,
            history: [
              {
                date: today,
                user: adminUser.name,
                action: 'تبدیل وضعیت از پیش‌رشد به رشد پس از تأیید شورای مرکز رشد'
              },
              ...(c.history || [])
            ]
          };
        })
      );
    }

    showToast('درخواست تأیید نهایی شد و وضعیت شرکت در کل سامانه از «پیش‌رشد» به «رشد» تغییر یافت.');
  };

  // ساختار منوی عمودی سمت راست
  const sidebarGroups = [
    {
      id: 'portal',
      title: 'پورتال و بانک شرکت‌ها',
      icon: Building2,
      items: [
        { id: 'public_home', label: 'دایرکتوری عمومی شرکت‌ها', icon: Globe },
        { id: 'comp_dashboard', label: 'داشبورد آماری شرکت‌ها', icon: BarChart3 },
        { id: 'comp_list', label: 'مدیریت شرکت‌ها', icon: Layers, badge: companies.length },
        { id: 'comp_form', label: 'ثبت دستی شرکت جدید', icon: Plus },
        { id: 'comp_excel', label: 'بارگذاری گروهی اکسل', icon: FileSpreadsheet },
        { id: 'comp_settings', label: 'سطوح دسترسی و پشتیبان', icon: Shield }
      ]
    },
    {
      id: 'hr',
      title: 'مدیریت نیروی انسانی',
      icon: Users,
      items: [
        {
          id: 'hr_company_panel',
          label: 'پرسنل و اعضای تیم (شرکت)',
          icon: UserPlus,
          badge: hrStats.returnedCount > 0 ? hrStats.returnedCount : undefined,
          highlight: hrStats.returnedCount > 0
        },
        {
          id: 'hr_center_inbox',
          label: 'مدیریت نیروی انسانی شرکت‌ها',
          icon: UserCheck,
          badge: hrStats.pendingReview,
          highlight: hrStats.pendingReview > 0
        },
        {
          id: 'hr_reports',
          label: 'گزارش‌های مدیریتی و آماری',
          icon: BarChart3
        }
      ]
    },
    {
      id: 'upgrade',
      title: 'تبدیل وضعیت شرکت',
      icon: Rocket,
      items: [
        {
          id: 'upg_company_form',
          label: 'پیش‌رشد به رشد (پنل شرکت)',
          icon: ClipboardList,
          badge: upgradeStats.returnedCount > 0 ? upgradeStats.returnedCount : undefined,
          highlight: upgradeStats.returnedCount > 0
        },
        {
          id: 'upg_center_inbox',
          label: 'درخواست‌های تبدیل وضعیت',
          icon: CheckSquare,
          badge: upgradeStats.pendingReview,
          highlight: upgradeStats.pendingReview > 0
        },
        {
          id: 'upg_future_annual',
          label: 'ارزیابی سالانه شرکت‌ها',
          icon: Award,
          disabled: true,
          futureTag: 'به‌زودی'
        },
        {
          id: 'upg_future_exit',
          label: 'خروج و رشدیافتگی شرکت‌ها',
          icon: Sparkles,
          disabled: true,
          futureTag: 'به‌زودی'
        }
      ]
    },
    {
      id: 'assets',
      title: 'اموال و تجهیزات',
      icon: Armchair,
      items: [
        { id: 'ast_dashboard', label: 'داشبورد مدیریت اموال', icon: BarChart3 },
        { id: 'ast_manage', label: 'ثبت و مدیریت اموال شرکت‌ها', icon: Package },
        {
          id: 'ast_company_confirm',
          label: 'تأیید اموال توسط شرکت',
          icon: ClipboardCheck,
          badge: assetStats.pendingConfirm + assetStats.discrepancyCount,
          highlight: assetStats.pendingConfirm + assetStats.discrepancyCount > 0
        },
        { id: 'ast_minutes', label: 'صورت‌جلسه تحویل و تحول', icon: FileCheck },
        { id: 'ast_reports', label: 'گزارش تجمیعی مرکز رشد', icon: FileSpreadsheet }
      ]
    },
    {
      id: 'secretariat',
      title: 'دبیرخانه الکترونیکی',
      icon: Mail,
      items: [
        { id: 'sec_dashboard', label: 'داشبورد دبیرخانه', icon: BarChart3 },
        { id: 'sec_incoming', label: 'نامه‌های وارده', icon: Inbox, badge: secStats.incoming },
        { id: 'sec_outgoing', label: 'نامه‌های صادره', icon: Send, badge: secStats.outgoing },
        { id: 'sec_new', label: 'ثبت نامه جدید', icon: FilePlus },
        { id: 'sec_mytasks', label: 'کارهای ارجاع‌شده به من', icon: Bell, badge: secStats.myTasks, highlight: secStats.myTasks > 0 },
        { id: 'sec_drafts', label: 'پیش‌نویس‌ها', icon: FileText, badge: secStats.drafts },
        { id: 'sec_indicator', label: 'دفتر اندیکاتور', icon: Database },
        { id: 'sec_archive', label: 'بایگانی و حذف‌شده‌ها', icon: Archive },
        { id: 'sec_templates', label: 'قالب‌های نامه (Word)', icon: FolderOpen },
        { id: 'sec_settings', label: 'تنظیمات دبیرخانه', icon: Settings }
      ]
    }
  ];

  const openCompanyDetail = (company) => {
    setSelectedCompanyId(company.id);
    setActiveSection('company_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderSidebarContent = (isMobile = false) => (
    <div className="flex flex-col h-full bg-[#0b1f3a] text-slate-200 select-none">
      {/* برندینگ سایدبار */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-blue-900/60 shrink-0">
        {(sidebarOpen || isMobile) && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div className="truncate">
              <div className="text-xs font-extrabold text-white truncate">مرکز رشد فناوری نخبگان</div>
              <div className="text-[10px] text-sky-300 truncate">پارک فناوری پردیس</div>
            </div>
          </div>
        )}
        {!isMobile && (
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            title={sidebarOpen ? 'بستن منو' : 'باز کردن منو'}
            className="p-2 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white mx-auto"
          >
            {sidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* لیست منوهای عمودی */}
      <div className="flex-1 overflow-y-auto py-3 px-2.5 space-y-3">
        {sidebarGroups.map((group) => {
          const isExpanded = openMenus[group.id];
          return (
            <div key={group.id} className="space-y-1">
              {(sidebarOpen || isMobile) && (
                <button
                  onClick={() => setOpenMenus((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                  className="w-full px-2.5 py-1.5 flex items-center justify-between text-[11px] font-bold text-sky-300/90 hover:text-white"
                >
                  <span>{group.title}</span>
                  <ChevronLeft className={`w-3.5 h-3.5 transition-transform ${isExpanded ? '-rotate-90' : ''}`} />
                </button>
              )}

              {(isExpanded || (!sidebarOpen && !isMobile)) && (
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        disabled={item.disabled}
                        onClick={() => !item.disabled && handleNavigate(item.id)}
                        title={item.label}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          item.disabled
                            ? 'opacity-45 cursor-not-allowed text-slate-400'
                            : isActive
                            ? 'bg-gradient-to-l from-blue-600 to-sky-500 text-white shadow-md'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <item.icon className="w-4 h-4 shrink-0" />
                          {(sidebarOpen || isMobile) && <span className="truncate">{item.label}</span>}
                        </div>
                        {(sidebarOpen || isMobile) && item.futureTag && (
                          <span className="px-1.5 py-0.5 rounded bg-white/10 text-[10px] text-sky-300">
                            {item.futureTag}
                          </span>
                        )}
                        {(sidebarOpen || isMobile) && !item.futureTag && item.badge !== undefined && (
                          <span
                            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.highlight
                                ? 'bg-amber-400 text-slate-950'
                                : isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-white/10 text-slate-300'
                            }`}
                          >
                            {toPersianDigits(item.badge)}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* انتخاب نقش کاربری فعال برای بررسی سطوح دسترسی */}
      {(sidebarOpen || isMobile) && (
        <div className="p-3 border-t border-blue-900/60 bg-[#081629] text-xs space-y-1.5">
          <span className="text-[10px] text-slate-400 block">نقش کاربری فعال (تست دسترسی):</span>
          <select
            value={adminUser.secretariatRole}
            onChange={(e) => {
              const r = e.target.value;
              const map = {
                system_admin: { role: 'admin', name: 'مدیر سیستم مرکز رشد', companyId: 'comp-1' },
                org_manager: { role: 'admin', name: 'رئیس مرکز رشد', companyId: 'comp-1' },
                expert: { role: 'expert', name: 'کارشناس ارزیابی', companyId: 'comp-1' },
                company_rep: { role: 'company', name: 'نماینده شرکت (پیش‌رشد)', companyId: 'comp-4' },
                viewer: { role: 'viewer', name: 'کاربر مشاهده‌کننده', companyId: 'comp-1' }
              };
              setAdminUser({ username: r, secretariatRole: r, ...map[r] });
              showToast(`نقش کاربری به «${map[r].name}» تغییر یافت.`);
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
          >
            <option value="system_admin">مدیر سیستم (دسترسی کامل)</option>
            <option value="org_manager">مدیر مجموعه / رئیس مرکز</option>
            <option value="expert">کارشناس مرکز رشد</option>
            <option value="company_rep">نماینده شرکت عضو</option>
            <option value="viewer">کاربر مشاهده‌کننده</option>
          </select>
        </div>
      )}
    </div>
  );

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* اعلان شناور */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border bg-white border-slate-200">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* منوی عمودی سمت راست در دسکتاپ */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 sticky top-0 h-screen z-40 no-print ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        {renderSidebarContent(false)}
      </aside>

      {/* منوی کشویی موبایل */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div className="w-72 h-full shadow-2xl">{renderSidebarContent(true)}</div>
          <div className="flex-1 bg-slate-950/60" onClick={() => setMobileDrawerOpen(false)} />
        </div>
      )}

      {/* فضای اصلی سمت چپ منو */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* نوار بالای صفحه: جست‌وجوی سریع و اعلان‌ها */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 no-print">
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalQuickSearch}
                onChange={(e) => setGlobalQuickSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && globalQuickSearch.trim()) {
                    handleNavigate('public_home');
                  }
                }}
                placeholder="جست‌وجوی سریع در شرکت‌ها، پرسنل، مکاتبات و اموال..."
                className="w-full pr-10 pl-4 py-2 rounded-xl bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 text-xs sm:text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* اعلان‌های جدید */}
          <div className="flex items-center gap-3 relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative"
            >
              <Bell className="w-5 h-5" />
              {(secStats.myTasks + hrStats.pendingReview + upgradeStats.pendingReview + assetStats.pendingConfirm) > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 absolute top-2 right-2" />
              )}
            </button>

            {showNotifDropdown && (
              <div className="absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 z-50 text-xs space-y-2.5">
                <div className="font-bold text-slate-900 border-b pb-2 flex justify-between">
                  <span>اعلان‌ها و کارتابل‌های فعال</span>
                  <button onClick={() => setShowNotifDropdown(false)}>
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
                <div
                  onClick={() => {
                    setShowNotifDropdown(false);
                    handleNavigate('hr_center_inbox');
                  }}
                  className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 cursor-pointer flex justify-between"
                >
                  <span>پرونده‌های پرسنلی منتظر تأیید</span>
                  <b>{toPersianDigits(hrStats.pendingReview)} مورد</b>
                </div>
                <div
                  onClick={() => {
                    setShowNotifDropdown(false);
                    handleNavigate('upg_center_inbox');
                  }}
                  className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 cursor-pointer flex justify-between"
                >
                  <span>درخواست‌های تبدیل وضعیت پیش‌رشد به رشد</span>
                  <b>{toPersianDigits(upgradeStats.pendingReview)} مورد</b>
                </div>
                <div
                  onClick={() => {
                    setShowNotifDropdown(false);
                    handleNavigate('ast_company_confirm');
                  }}
                  className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 cursor-pointer flex justify-between"
                >
                  <span>اموال در انتظار تأیید شرکت‌ها</span>
                  <b>{toPersianDigits(assetStats.pendingConfirm)} مورد</b>
                </div>
                <div
                  onClick={() => {
                    setShowNotifDropdown(false);
                    handleNavigate('sec_mytasks');
                  }}
                  className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 cursor-pointer flex justify-between"
                >
                  <span>مکاتبات ارجاع‌شده به شما</span>
                  <b>{toPersianDigits(secStats.myTasks)} مورد</b>
                </div>
              </div>
            )}

            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200 text-xs font-bold text-[#0f294a]">
              <Shield className="w-4 h-4 text-blue-600" />
              <span>{adminUser.name}</span>
            </div>
          </div>
        </header>

        {/* بدنه محتوا */}
        <main className="flex-1">
          {activeSection === 'public_home' && (
            <PublicDirectoryView
              companies={companies}
              stats={stats}
              initialSearch={globalQuickSearch}
              onSelectCompany={openCompanyDetail}
            />
          )}

          {activeSection === 'company_detail' && (
            <CompanyProfileView
              company={companies.find((c) => c.id === selectedCompanyId)}
              companyAssets={assetsState.items.filter((a) => a.companyId === selectedCompanyId)}
              companyPersonnel={(hrState.personnel || []).filter((p) => p.companyId === selectedCompanyId)}
              companyVehicles={(hrState.companyVehicles || []).filter((v) => v.companyId === selectedCompanyId)}
              accessPolicies={accessPolicies}
              isAdmin={adminUser?.role === 'admin'}
              onBack={() => handleNavigate('public_home')}
              onEdit={(comp) => {
                setEditingCompany(comp);
                setActiveSection('comp_form');
              }}
              onExportMinutes={(comp, compAssets) => {
                exportAssetMinutesToDocx(comp, compAssets, secretariat.settings);
                showToast('فایل Word صورت‌جلسه اموال شرکت دانلود شد.');
              }}
            />
          )}

          {activeSection === 'comp_dashboard' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminDashboardTab
                stats={stats}
                onNavigateTab={handleNavigate}
                onEditCompany={(c) => {
                  setEditingCompany(c);
                  setActiveSection('comp_form');
                }}
              />
            </div>
          )}

          {activeSection === 'comp_list' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminCompaniesListTab
                companies={companies}
                setCompanies={setCompanies}
                isSuperAdmin={adminUser.role === 'admin'}
                adminUser={adminUser}
                onEdit={(c) => {
                  setEditingCompany(c);
                  setActiveSection('comp_form');
                }}
                onViewPublic={openCompanyDetail}
                showToast={showToast}
              />
            </div>
          )}

          {activeSection === 'comp_form' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminCompanyFormTab
                editingCompany={editingCompany}
                companies={companies}
                setCompanies={setCompanies}
                adminUser={adminUser}
                onDone={() => {
                  setEditingCompany(null);
                  handleNavigate('comp_list');
                }}
                showToast={showToast}
              />
            </div>
          )}

          {activeSection === 'comp_excel' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminExcelImportTab
                companies={companies}
                setCompanies={setCompanies}
                adminUser={adminUser}
                onDone={() => handleNavigate('comp_list')}
                showToast={showToast}
              />
            </div>
          )}

          {activeSection === 'comp_settings' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminSettingsTab
                companies={companies}
                setCompanies={setCompanies}
                accessPolicies={accessPolicies}
                setAccessPolicies={setAccessPolicies}
                isSuperAdmin={adminUser.role === 'admin'}
                showToast={showToast}
              />
            </div>
          )}

          {/* ماژول مدیریت نیروی انسانی */}
          {activeSection === 'hr_company_panel' && (
            <CompanyHRPortalView
              companies={companies}
              hrState={hrState}
              setHrState={setHrState}
              adminUser={adminUser}
              onSavePersonnel={handleSavePersonnel}
              onStatusTransition={handlePersonnelStatusTransition}
              showToast={showToast}
            />
          )}

          {activeSection === 'hr_center_inbox' && (
            <CenterHRManagementView
              companies={companies}
              hrState={hrState}
              adminUser={adminUser}
              onReviewPersonnel={handleCenterReviewPersonnel}
              showToast={showToast}
            />
          )}

          {activeSection === 'hr_reports' && (
            <CenterHRReportsView companies={companies} hrState={hrState} showToast={showToast} />
          )}

          {/* ماژول تبدیل وضعیت شرکت */}
          {activeSection === 'upg_company_form' && (
            <CompanyUpgradePortalView
              companies={companies}
              upgradeState={upgradeState}
              adminUser={adminUser}
              onSaveRequest={handleSaveUpgradeRequest}
              showToast={showToast}
            />
          )}

          {activeSection === 'upg_center_inbox' && (
            <CenterUpgradeInboxView
              upgradeState={upgradeState}
              adminUser={adminUser}
              onReturnRequest={handleReturnUpgradeRequest}
              onApproveRequest={handleApproveUpgradeRequest}
              showToast={showToast}
            />
          )}

          {/* ماژول اموال و تجهیزات */}
          {activeSection === 'ast_dashboard' && (
            <AssetsDashboardView
              assetsState={assetsState}
              assetStats={assetStats}
              onNavigate={handleNavigate}
            />
          )}

          {activeSection === 'ast_manage' && (
            <AssetsManagementView
              companies={companies}
              assetsState={assetsState}
              setAssetsState={setAssetsState}
              adminUser={adminUser}
              showToast={showToast}
            />
          )}

          {activeSection === 'ast_company_confirm' && (
            <CompanyAssetConfirmationView
              companies={companies}
              assetsState={assetsState}
              setAssetsState={setAssetsState}
              adminUser={adminUser}
              showToast={showToast}
            />
          )}

          {activeSection === 'ast_minutes' && (
            <AssetMinutesView
              companies={companies}
              assetsState={assetsState}
              settings={secretariat.settings}
              showToast={showToast}
            />
          )}

          {activeSection === 'ast_reports' && (
            <AssetsAggregateReportView
              companies={companies}
              assetsState={assetsState}
              showToast={showToast}
            />
          )}

          {/* ماژول دبیرخانه الکترونیکی */}
          {activeSection.startsWith('sec_') && (
            <SecretariatModuleView
              subSection={activeSection}
              secretariat={secretariat}
              setSecretariat={setSecretariat}
              secStats={secStats}
              adminUser={adminUser}
              onNavigate={handleNavigate}
              showToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

// ============================================================================
// ۵. دایرکتوری عمومی معرفی شرکت‌ها و صفحه اختصاصی شناسنامه شرکت
// ============================================================================
function PublicDirectoryView({ companies, stats, initialSearch = '', onSelectCompany }) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedField, setSelectedField] = useState('همه');
  const [selectedLevel, setSelectedLevel] = useState('همه');
  const [selectedStatus, setSelectedStatus] = useState('همه');
  const [selectedKB, setSelectedKB] = useState('همه');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (initialSearch) setSearchQuery(initialSearch);
  }, [initialSearch]);

  const publicCompanies = useMemo(() => companies.filter((c) => c.isPublic), [companies]);
  const featuredCompanies = useMemo(() => publicCompanies.filter((c) => c.isFeatured), [publicCompanies]);

  const filterOptions = useMemo(
    () => ({
      fields: ['همه', ...new Set(publicCompanies.map((c) => c.field).filter(Boolean))],
      levels: ['همه', ...new Set(publicCompanies.map((c) => c.level).filter(Boolean))],
      statuses: ['همه', ...new Set(publicCompanies.map((c) => c.status).filter(Boolean))]
    }),
    [publicCompanies]
  );

  const filteredCompanies = useMemo(() => {
    return publicCompanies.filter((c) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.field && c.field.toLowerCase().includes(q)) ||
        (c.shortDesc && c.shortDesc.toLowerCase().includes(q));
      const matchesField = selectedField === 'همه' || c.field === selectedField;
      const matchesLevel = selectedLevel === 'همه' || c.level === selectedLevel;
      const matchesStatus = selectedStatus === 'همه' || c.status === selectedStatus;
      const isKB = c.knowledgeBased && c.knowledgeBased.includes('دانش‌بنیان') && !c.knowledgeBased.includes('خیر');
      const matchesKB =
        selectedKB === 'همه' ||
        (selectedKB === 'دانش‌بنیان' && isKB) ||
        (selectedKB === 'غیر دانش‌بنیان' && !isKB);
      return matchesSearch && matchesField && matchesLevel && matchesStatus && matchesKB;
    });
  }, [publicCompanies, searchQuery, selectedField, selectedLevel, selectedStatus, selectedKB]);

  return (
    <div>
      {/* بنر معرفی مرکز رشد */}
      <section className="bg-gradient-to-bl from-[#0b1f3a] via-[#102c54] to-[#1e40af] text-white py-12 sm:py-16 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sky-200 text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>اکوسیستم نوآوری و فناوری پارک فناوری پردیس</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-3">
              شرکت‌های عضو مرکز رشد فناوری نخبگان
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              معرفی توانمندی‌ها، محصولات و دستاوردهای شرکت‌ها و هسته‌های فناور عضو مرکز رشد فناوری نخبگان پارک فناوری پردیس
            </p>
          </div>
        </div>
      </section>

      {/* آمار تجمیعی */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-7 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {[
            { label: 'کل شرکت‌ها و هسته‌ها', value: stats.publicTotal, icon: Building2, color: 'text-blue-700 bg-blue-50' },
            { label: 'شرکت‌های فعال', value: stats.activeCount, icon: CheckCircle, color: 'text-emerald-700 bg-emerald-50' },
            { label: 'شرکت‌های دانش‌بنیان', value: stats.kbCount, icon: Award, color: 'text-indigo-700 bg-indigo-50' },
            { label: 'محصولات و خدمات', value: stats.totalProducts, icon: Package, color: 'text-sky-700 bg-sky-50' },
            { label: 'مجموع نیروی انسانی', value: stats.totalStaff, icon: Users, color: 'text-amber-700 bg-amber-50' },
            { label: 'حوزه‌های فناوری', value: stats.fieldsCount, icon: Layers, color: 'text-purple-700 bg-purple-50' }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/90 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900">{toPersianDigits(item.value)}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* شرکت‌های منتخب */}
      {featuredCompanies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">شرکت‌های منتخب مرکز رشد</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredCompanies.slice(0, 3).map((company) => (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company)}
                className="bg-gradient-to-b from-white to-blue-50/40 rounded-2xl p-5 border border-blue-200/80 shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CompanyAvatar company={company} size="md" />
                    <div>
                      <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md mb-1">
                        {company.field}
                      </span>
                      <h4 className="font-bold text-slate-900 line-clamp-1">{company.name}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-6 line-clamp-2 mb-3">{company.shortDesc}</p>
                </div>
                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500">{company.level}</span>
                  <span className="text-blue-700 font-semibold flex items-center gap-1">
                    مشاهده شناسنامه
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* جست‌وجو و فهرست جامع */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pb-12">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو بر اساس نام شرکت یا حوزه فناوری..."
                className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-600"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-sm font-medium flex items-center gap-2 hover:bg-slate-50"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>فیلترهای پیشرفته</span>
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50">
                {filterOptions.fields.map((f) => <option key={f} value={f}>حوزه: {f}</option>)}
              </select>
              <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50">
                {filterOptions.levels.map((l) => <option key={l} value={l}>سطح: {l}</option>)}
              </select>
              <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50">
                {filterOptions.statuses.map((s) => <option key={s} value={s}>وضعیت: {s}</option>)}
              </select>
              <select value={selectedKB} onChange={(e) => setSelectedKB(e.target.value)} className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50">
                <option value="همه">وضعیت دانش‌بنیان: همه</option>
                <option value="دانش‌بنیان">دانش‌بنیان</option>
                <option value="غیر دانش‌بنیان">غیر دانش‌بنیان</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start gap-3.5 mb-3">
                  <CompanyAvatar company={company} size="md" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {company.status}
                    </span>
                    <h4
                      onClick={() => onSelectCompany(company)}
                      className="font-bold text-slate-900 text-base hover:text-blue-700 cursor-pointer truncate mt-1"
                    >
                      {company.name}
                    </h4>
                    <p className="text-xs text-slate-500 truncate">{company.field}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-6 line-clamp-3 mb-4">{company.shortDesc}</p>
              </div>
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500">{company.level}</span>
                <button
                  onClick={() => onSelectCompany(company)}
                  className="px-3.5 py-1.5 rounded-lg bg-[#0f294a] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <span>مشاهده شناسنامه</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// صفحه شناسنامه اختصاصی شرکت (شامل تب عمومی، تب «نیروی انسانی» و تب «اموال تحویلی»)
function CompanyProfileView({
  company,
  companyAssets = [],
  companyPersonnel = [],
  companyVehicles = [],
  accessPolicies,
  isAdmin,
  onBack,
  onEdit,
  onExportMinutes
}) {
  const [profileTab, setProfileTab] = useState('general');
  if (!company) return null;

  const canShowInvestment = isAdmin || (accessPolicies.investmentData !== 'admin_only' && company.publishInvestment);
  const canShowSales = isAdmin || (accessPolicies.salesData !== 'admin_only' && company.publishSales);
  const activePersonnel = companyPersonnel.filter((p) => p.cooperationStatus === 'فعال');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت</span>
        </button>
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => onEdit(company)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-sm font-semibold flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>ویرایش اطلاعات</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-sm font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>دریافت PDF / چاپ</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-l from-[#0b1f3a] to-[#1e3a8a] text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <CompanyAvatar company={company} size="lg" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200">
                  {company.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-200">
                  {company.level}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">{company.name}</h1>
              <p className="text-sky-200 text-sm">{company.field}</p>
            </div>
          </div>
        </div>

        {/* تب‌های پرونده شرکت */}
        <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2 no-print">
          <button
            onClick={() => setProfileTab('general')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold whitespace-nowrap ${
              profileTab === 'general' ? 'bg-white text-[#0f294a] border-t border-x border-slate-200' : 'text-slate-600'
            }`}
          >
            شناسنامه عمومی و محصولات
          </button>
          <button
            onClick={() => setProfileTab('hr')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
              profileTab === 'hr' ? 'bg-white text-[#0f294a] border-t border-x border-slate-200' : 'text-slate-600'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>نیروی انسانی ({toPersianDigits(activePersonnel.length)})</span>
          </button>
          <button
            onClick={() => setProfileTab('assets')}
            className={`px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 whitespace-nowrap ${
              profileTab === 'assets' ? 'bg-white text-[#0f294a] border-t border-x border-slate-200' : 'text-slate-600'
            }`}
          >
            <Armchair className="w-4 h-4 text-blue-600" />
            <span>اموال تحویلی ({toPersianDigits(companyAssets.length)})</span>
          </button>
        </div>

        {profileTab === 'hr' ? (
          <div className="p-6 sm:p-8 space-y-6 text-xs">
            <div>
              <h2 className="text-base font-bold text-[#0f294a]">
                ساختار نیروی انسانی، قراردادها و خودروهای تردد ({company.name})
              </h2>
              <p className="text-slate-500 mt-0.5">
                پرسنل فعال ثبت‌شده: <b>{toPersianDigits(activePersonnel.length)} نفر</b> | کل سوابق: <b>{toPersianDigits(companyPersonnel.length)} نفر</b>
              </p>
            </div>

            {companyPersonnel.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-slate-500">
                اطلاعات تفصیلی پرسنل برای این شرکت ثبت نشده است.
              </div>
            ) : (
              <>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-right">
                    <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-3">نام و نام خانوادگی</th>
                        <th className="py-3 px-3">شماره ملی</th>
                        <th className="py-3 px-3">جایگاه شغلی / واحد</th>
                        <th className="py-3 px-3">نوع قرارداد</th>
                        <th className="py-3 px-3">وضعیت حضور</th>
                        <th className="py-3 px-3">وضعیت همکاری</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {companyPersonnel.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="py-3 px-3 font-bold text-slate-900">{p.firstName} {p.lastName}</td>
                          <td className="py-3 px-3 font-mono" dir="ltr">
                            {isAdmin ? toPersianDigits(p.nationalId) : toPersianDigits(maskNationalId(p.nationalId))}
                          </td>
                          <td className="py-3 px-3">{p.jobTitle} ({p.orgUnit})</td>
                          <td className="py-3 px-3">{p.contractType}</td>
                          <td className="py-3 px-3">{p.attendanceMode}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${p.cooperationStatus === 'فعال' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                              {p.cooperationStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-sm text-[#0f294a] flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-600" />
                    خودروهای مجاز تردد ثبت‌شده
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {companyVehicles.map((cv) => (
                      <div key={cv.id} className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between">
                        <span><b>{cv.brandModel}</b> ({cv.ownerType})</span>
                        <span className="font-mono font-bold text-blue-900">{toPersianDigits(cv.plateNumber)}</span>
                      </div>
                    ))}
                    {companyPersonnel.flatMap((p) =>
                      (p.vehicles || []).map((v) => (
                        <div key={v.id} className="p-3 rounded-xl bg-white border border-slate-200 flex justify-between">
                          <span><b>{v.brandModel}</b> — {p.firstName} {p.lastName}</span>
                          <span className="font-mono font-bold text-slate-800">{toPersianDigits(v.plateNumber)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : profileTab === 'assets' ? (
          <div className="p-6 sm:p-8 space-y-5 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-bold text-[#0f294a]">
                فهرست اموال و تجهیزات تحویلی مرکز رشد به شرکت ({company.name})
              </h2>
              <button
                onClick={() => onExportMinutes(company, companyAssets)}
                className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>دریافت صورت‌جلسه Word</span>
              </button>
            </div>
            {companyAssets.length === 0 ? (
              <p className="text-slate-500 py-6 text-center bg-slate-50 rounded-2xl">اموالی برای این شرکت ثبت نشده است.</p>
            ) : (
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-right">
                  <thead className="bg-slate-50 border-b">
                    <tr>
                      <th className="py-3 px-3">نام قلم</th>
                      <th className="py-3 px-3">کد اموال</th>
                      <th className="py-3 px-3">اولیه</th>
                      <th className="py-3 px-3">اضافه‌شده</th>
                      <th className="py-3 px-3">مسترد</th>
                      <th className="py-3 px-3">موجودی فعلی</th>
                      <th className="py-3 px-3">وضعیت تأیید</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {companyAssets.map((it) => {
                      const q = computeAssetQuantities(it);
                      return (
                        <tr key={it.id}>
                          <td className="py-3 px-3 font-bold">{it.itemName}</td>
                          <td className="py-3 px-3 font-mono">{toPersianDigits(it.assetCode || '—')}</td>
                          <td className="py-3 px-3">{toPersianDigits(q.initialQty)}</td>
                          <td className="py-3 px-3 text-emerald-700">+{toPersianDigits(q.addedQty)}</td>
                          <td className="py-3 px-3 text-rose-700">-{toPersianDigits(q.returnedQty)}</td>
                          <td className="py-3 px-3 font-extrabold text-blue-900">{toPersianDigits(q.currentQty)}</td>
                          <td className="py-3 px-3">{it.confirmationStatus}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h2 className="text-base font-bold text-[#0f294a] mb-2">معرفی عمومی</h2>
              <p className="text-sm text-slate-700 leading-7">{company.shortDesc}</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border">نوع شرکت: <b>{company.companyType}</b></div>
              <div className="bg-slate-50 p-3.5 rounded-xl border">تاریخ تأسیس: <b>{toPersianDigits(company.establishedDate)}</b></div>
              <div className="bg-slate-50 p-3.5 rounded-xl border">تلفن ثابت: <b dir="ltr">{toPersianDigits(company.landline)}</b></div>
              <div className="bg-slate-50 p-3.5 rounded-xl border">نیروی انسانی: <b>{toPersianDigits(company.totalStaff)} نفر</b></div>
            </div>
            {canShowInvestment && company.investmentAmount && (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                میزان سرمایه‌گذاری جذب‌شده: <b>{toPersianDigits(company.investmentAmount)}</b>
              </div>
            )}
            {canShowSales && company.salesYear1 && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs">
                فروش سال اول: <b>{toPersianDigits(company.salesYear1)}</b> | سال دوم: <b>{toPersianDigits(company.salesYear2)}</b>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// ۶. کامپوننت‌های مدیریت شرکت‌ها (داشبورد، لیست، فرم ۸ تبی، اکسل، تنظیمات)
// ============================================================================
function AdminDashboardTab({ stats, onNavigateTab, onEditCompany }) {
  const maxFieldCount = Math.max(...Object.values(stats.byField), 1);
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'کل شرکت‌ها و هسته‌ها', val: stats.total, color: 'border-blue-500' },
          { label: 'شرکت‌های فعال', val: stats.activeCount, color: 'border-emerald-500' },
          { label: 'شرکت‌های خارج‌شده', val: stats.exitedCount, color: 'border-slate-500' },
          { label: 'شرکت‌های دانش‌بنیان', val: stats.kbCount, color: 'border-indigo-500' },
          { label: 'مجموع محصولات', val: stats.totalProducts, color: 'border-amber-500' }
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border-r-4 ${card.color} shadow-sm border border-slate-200`}>
            <span className="text-xs text-slate-500 block mb-2">{card.label}</span>
            <span className="text-3xl font-extrabold text-slate-900">{toPersianDigits(card.val)}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4">تعداد شرکت‌ها بر اساس حوزه فعالیت</h3>
          <div className="space-y-3">
            {Object.entries(stats.byField).map(([field, count]) => (
              <div key={field}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>{field}</span>
                  <b>{toPersianDigits(count)} شرکت</b>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(count / maxFieldCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">عملیات سریع مدیریت بانک شرکت‌ها</h3>
          <button onClick={() => onNavigateTab('comp_excel')} className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold flex items-center justify-center gap-2">
            <Upload className="w-4 h-4" />
            <span>بارگذاری گروهی اکسل شرکت‌ها</span>
          </button>
          <button onClick={() => onNavigateTab('comp_form')} className="w-full py-3 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            <span>ثبت دستی شرکت جدید</span>
          </button>
          {stats.expiringCompanies.map((c) => (
            <div key={c.id} className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex justify-between items-center text-xs">
              <span><b>{c.name}</b> — {c.membershipStatus}</span>
              <button onClick={() => onEditCompany(c)} className="px-2.5 py-1 rounded bg-white border border-amber-300 font-bold">بررسی</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AdminCompaniesListTab({ companies, setCompanies, isSuperAdmin, adminUser, onEdit, onViewPublic, showToast }) {
  const [search, setSearch] = useState('');
  const filtered = companies.filter((c) => !search || (c.name && c.name.includes(search)) || (c.nationalId && c.nationalId.includes(search)));

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-wrap justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جست‌وجو نام شرکت یا شناسه ملی..."
          className="px-4 py-2 rounded-xl border border-slate-300 text-sm max-w-md w-full"
        />
        <span className="text-xs text-slate-500 self-center">{toPersianDigits(filtered.length)} رکورد</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="py-3.5 px-4">نام شرکت</th>
              <th className="py-3.5 px-4">حوزه فعالیت</th>
              <th className="py-3.5 px-4">وضعیت</th>
              <th className="py-3.5 px-4 text-center">انتشار عمومی</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="py-3.5 px-4 font-bold">{c.name}</td>
                <td className="py-3.5 px-4">{c.field}</td>
                <td className="py-3.5 px-4">{c.status} ({c.level})</td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => {
                      setCompanies((prev) => prev.map((x) => (x.id === c.id ? { ...x, isPublic: !x.isPublic } : x)));
                      showToast('وضعیت انتشار تغییر کرد.');
                    }}
                    className={`px-3 py-1 rounded-full font-bold ${c.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}
                  >
                    {c.isPublic ? 'منتشرشده' : 'پیش‌نویس'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center space-x-1 space-x-reverse">
                  <button onClick={() => onViewPublic(c)} className="p-1.5 text-blue-600"><Eye className="w-4 h-4" /></button>
                  <button onClick={() => onEdit(c)} className="p-1.5 text-amber-600"><Edit className="w-4 h-4" /></button>
                  {isSuperAdmin && (
                    <button
                      onClick={() => {
                        setCompanies((prev) => prev.filter((x) => x.id !== c.id));
                        showToast('شرکت حذف شد.');
                      }}
                      className="p-1.5 text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AdminCompanyFormTab({ editingCompany, companies, setCompanies, adminUser, onDone, showToast }) {
  const [formData, setFormData] = useState(
    editingCompany || {
      name: '',
      status: 'فعال',
      level: 'سطح ۳ (پیش‌رشد)',
      companyType: 'سهامی خاص',
      nationalId: '',
      ceoName: '',
      unitNumber: '',
      field: 'هوش مصنوعی و فناوری اطلاعات',
      knowledgeBased: 'خیر',
      totalStaff: 0,
      femaleStaff: 0,
      shortDesc: '',
      isPublic: true,
      isFeatured: false
    }
  );

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('نام شرکت الزامی است.', 'error');
      return;
    }
    if (editingCompany) {
      setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? formData : c)));
      showToast('تغییرات ذخیره شد.');
    } else {
      setCompanies((prev) => [{ ...formData, id: 'comp-' + Date.now(), slug: generateSlug(formData.name) }, ...prev]);
      showToast('شرکت جدید ثبت شد.');
    }
    onDone();
  };

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
      <h3 className="text-base font-bold text-slate-900">{editingCompany ? `ویرایش: ${editingCompany.name}` : 'ثبت شرکت جدید'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block font-bold mb-1">نام شرکت / هسته فناور *</label>
          <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 rounded-xl border" required />
        </div>
        <div>
          <label className="block font-bold mb-1">شناسه ملی</label>
          <input type="text" dir="ltr" value={formData.nationalId} onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })} className="w-full px-3 py-2 rounded-xl border" />
        </div>
        <div>
          <label className="block font-bold mb-1">سطح‌بندی</label>
          <select value={formData.level} onChange={(e) => setFormData({ ...formData, level: e.target.value })} className="w-full px-3 py-2 rounded-xl border bg-white">
            <option value="سطح ۳ (پیش‌رشد)">سطح ۳ (پیش‌رشد)</option>
            <option value="سطح ۲ (رشد مقدماتی)">سطح ۲ (رشد مقدماتی)</option>
            <option value="سطح ۱ (رشد پیشرفته)">سطح ۱ (رشد پیشرفته)</option>
          </select>
        </div>
        <div>
          <label className="block font-bold mb-1">نام مدیرعامل</label>
          <input type="text" value={formData.ceoName} onChange={(e) => setFormData({ ...formData, ceoName: e.target.value })} className="w-full px-3 py-2 rounded-xl border" />
        </div>
        <div>
          <label className="block font-bold mb-1">حوزه فعالیت</label>
          <input type="text" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })} className="w-full px-3 py-2 rounded-xl border" />
        </div>
        <div>
          <label className="block font-bold mb-1">واحد استقرار</label>
          <input type="text" value={formData.unitNumber} onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })} className="w-full px-3 py-2 rounded-xl border" />
        </div>
        <div className="md:col-span-3">
          <label className="block font-bold mb-1">معرفی کوتاه</label>
          <textarea rows={3} value={formData.shortDesc} onChange={(e) => setFormData({ ...formData, shortDesc: e.target.value })} className="w-full px-3 py-2 rounded-xl border" />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="px-4 py-2 rounded-xl border">انصراف</button>
        <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">ذخیره اطلاعات</button>
      </div>
    </form>
  );
}

function AdminExcelImportTab({ companies, setCompanies, onDone, showToast }) {
  const [rows, setRows] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.XLSX) {
      showToast('کتابخانه پردازش اکسل در حال بارگذاری است؛ چند ثانیه دیگر دوباره تلاش کنید.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = window.XLSX.read(new Uint8Array(evt.target.result), { type: 'array' });
      const data = window.XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      setRows(data);
      showToast(`${toPersianDigits(data.length)} ردیف از اکسل خوانده شد.`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    const mapped = rows
      .filter((r) => r['نام شرکت'] || r['نام شرکت/هسته فناور'])
      .map((r, idx) => {
        const name = r['نام شرکت/هسته فناور'] || r['نام شرکت'];
        return {
          id: 'comp-xl-' + Date.now() + '-' + idx,
          slug: generateSlug(name),
          name,
          nationalId: String(r['شناسه ملی'] || ''),
          status: r['وضعیت'] || 'فعال',
          level: r['سطح‌بندی'] || 'سطح ۲ (رشد مقدماتی)',
          field: r['حوزه فعالیت'] || 'فناوری اطلاعات',
          ceoName: r['نام مدیرعامل'] || '',
          totalStaff: Number(r['تعداد کل نیروی انسانی']) || 0,
          femaleStaff: Number(r['تعداد بانوان']) || 0,
          shortDesc: r['توضیحات'] || 'شرکت عضو مرکز رشد فناوری نخبگان',
          isPublic: true,
          isFeatured: false
        };
      });
    setCompanies((prev) => [...mapped, ...prev]);
    showToast(`${toPersianDigits(mapped.length)} شرکت وارد پایگاه داده شد.`);
    onDone();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
      <h3 className="text-base font-bold">بارگذاری گروهی اطلاعات شرکت‌ها از فایل اکسل (XLSX / XLS)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFile} className="block" />
      {rows.length > 0 && (
        <div className="space-y-3">
          <p className="text-emerald-700 font-bold">تعداد {toPersianDigits(rows.length)} ردیف آماده انتقال است.</p>
          <button onClick={handleImport} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold">
            تأیید و ثبت در پایگاه داده
          </button>
        </div>
      )}
    </div>
  );
}

function AdminSettingsTab({ companies, setCompanies, accessPolicies, setAccessPolicies, showToast }) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4 text-xs">
      <h3 className="text-base font-bold">تنظیمات سطوح دسترسی و پشتیبان‌گیری</h3>
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => {
            const blob = new Blob([JSON.stringify(companies, null, 2)], { type: 'application/json' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = 'nokhbegan-backup.json';
            a.click();
            showToast('فایل پشتیبان دانلود شد.');
          }}
          className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
        >
          دانلود نسخه پشتیبان (JSON)
        </button>
        <button
          onClick={() => {
            setCompanies(INITIAL_COMPANIES);
            showToast('داده‌های نمونه اولیه بازیابی شدند.');
          }}
          className="px-4 py-2 rounded-xl bg-slate-700 text-white font-bold"
        >
          بازیابی داده‌های اولیه
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// ۷. ماژول مدیریت نیروی انسانی شرکت‌ها (پنل شرکت، کارتابل مرکز رشد و گزارش‌ها)
// ============================================================================
const createEmptyPersonnelRecord = (company) => ({
  id: '',
  companyId: company?.id || 'comp-1',
  companyName: company?.name || '',
  reviewStatus: 'پیش‌نویس',
  returnNote: '',
  firstName: '',
  lastName: '',
  fatherName: '',
  nationalId: '',
  birthDate: '',
  mobile: '',
  email: '',
  gender: 'مرد',
  avatarUrl: '',
  jobTitle: '',
  orgUnit: 'فنی و مهندسی',
  specialty: '',
  degree: 'کارشناسی ارشد',
  major: '',
  experienceYears: 0,
  startDate: getTodayJalali(),
  cooperationType: 'تمام‌وقت',
  contractType: 'قرارداد استخدامی',
  contractDuration: 'یک‌ساله',
  contractStartDate: getTodayJalali(),
  contractEndDate: '',
  cooperationStatus: 'فعال',
  exitDate: '',
  exitReason: '',
  attendanceMode: 'حضوری در محل شرکت',
  weeklyPresenceDays: 5,
  workingHours: '۰۸:۳۰ الی ۱۷:۰۰',
  presenceDaysOfWeek: 'شنبه تا چهارشنبه',
  activityNotes: '',
  workLocation: 'واحد اختصاصی شرکت در مرکز رشد',
  hasVehicle: false,
  vehicles: [],
  sharedCompanyVehicleIds: [],
  documents: {
    contractFile: null,
    resumeFile: null,
    educationFile: null,
    nationalCardFile: null,
    otherFile: null
  },
  history: []
});

function CompanyHRPortalView({
  companies,
  hrState,
  setHrState,
  adminUser,
  onSavePersonnel,
  onStatusTransition,
  showToast
}) {
  const lockedCompanyId = adminUser?.secretariatRole === 'company_rep' ? adminUser.companyId || 'comp-4' : null;
  const [selectedCompanyId, setSelectedCompanyId] = useState(lockedCompanyId || companies[0]?.id || 'comp-1');
  const activeCompany = companies.find((c) => c.id === selectedCompanyId) || companies[0];

  const companyPersonnel = useMemo(
    () => (hrState.personnel || []).filter((p) => p.companyId === selectedCompanyId),
    [hrState.personnel, selectedCompanyId]
  );

  const companySharedVehicles = useMemo(
    () => (hrState.companyVehicles || []).filter((v) => v.companyId === selectedCompanyId),
    [hrState.companyVehicles, selectedCompanyId]
  );

  const stats = useMemo(() => {
    const active = companyPersonnel.filter((p) => p.cooperationStatus === 'فعال');
    const fullTime = active.filter((p) => p.cooperationType === 'تمام‌وقت').length;
    const partTime = active.filter((p) => p.cooperationType === 'پاره‌وقت').length;
    const projectOrConsult = active.filter((p) => ['پروژه‌ای', 'مشاور'].includes(p.cooperationType)).length;
    const onSite = active.filter((p) => p.attendanceMode === 'حضوری در محل شرکت').length;
    const remote = active.filter((p) => p.attendanceMode === 'دورکار / مجازی').length;
    const withVehicle = active.filter(
      (p) => p.hasVehicle || (p.vehicles?.length || 0) > 0 || (p.sharedCompanyVehicleIds?.length || 0) > 0
    ).length;
    const expiringContracts = active.filter(
      (p) =>
        p.contractEndDate &&
        (p.contractEndDate.startsWith('1404') || p.contractEndDate.startsWith('1405/01') || p.contractEndDate.startsWith('1405/02'))
    ).length;

    return {
      total: companyPersonnel.length,
      active: active.length,
      fullTime,
      partTime,
      projectOrConsult,
      onSite,
      remote,
      withVehicle,
      expiringContracts
    };
  }, [companyPersonnel]);

  const [search, setSearch] = useState('');
  const [filterContract, setFilterContract] = useState('همه');
  const [filterAttendance, setFilterAttendance] = useState('همه');
  const [filterStatus, setFilterStatus] = useState('همه');
  const [filterRole, setFilterRole] = useState('');

  const filteredPersonnel = useMemo(() => {
    return companyPersonnel.filter((p) => {
      const q = search.trim();
      if (q && !`${p.firstName} ${p.lastName} ${p.nationalId} ${p.jobTitle}`.includes(q)) return false;
      if (filterContract !== 'همه' && p.contractType !== filterContract) return false;
      if (filterAttendance !== 'همه' && p.attendanceMode !== filterAttendance) return false;
      if (filterStatus !== 'همه' && p.cooperationStatus !== filterStatus) return false;
      if (filterRole.trim() && !(p.jobTitle || '').includes(filterRole.trim())) return false;
      return true;
    });
  }, [companyPersonnel, search, filterContract, filterAttendance, filterStatus, filterRole]);

  const [editingPerson, setEditingPerson] = useState(null);
  const [formStep, setFormStep] = useState(1);
  const [quickAddAnother, setQuickAddAnother] = useState(false);

  const [viewingPerson, setViewingPerson] = useState(null);
  const [exitModalPerson, setExitModalPerson] = useState(null);
  const [exitDate, setExitDate] = useState(getTodayJalali());
  const [exitReason, setExitReason] = useState('');

  const [rehireModalPerson, setRehireModalPerson] = useState(null);
  const [rehireStartDate, setRehireStartDate] = useState(getTodayJalali());
  const [rehireContractType, setRehireContractType] = useState('قرارداد استخدامی');
  const [rehireContractEnd, setRehireContractEnd] = useState('');

  const [showSharedVehicleModal, setShowSharedVehicleModal] = useState(false);
  const [newCompanyVeh, setNewCompanyVeh] = useState({
    vehicleType: 'سواری',
    brandModel: '',
    color: '',
    plateNumber: '',
    ownerType: 'متعلق به شرکت',
    notes: ''
  });

  const handleFileAttach = (file, cb) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      cb({
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        dataUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveForm = (sendForReview) => {
    if (!editingPerson.firstName.trim() || !editingPerson.lastName.trim()) {
      showToast('وارد کردن نام و نام خانوادگی فرد الزامی است.', 'error');
      setFormStep(1);
      return;
    }
    const nid = String(editingPerson.nationalId || '').trim();
    if (!/^\d{10}$/.test(nid)) {
      showToast('شماره ملی فرد باید دقیقاً ۱۰ رقم عددی باشد.', 'error');
      setFormStep(1);
      return;
    }
    const duplicate = companyPersonnel.find((p) => p.nationalId === nid && p.id !== editingPerson.id);
    if (duplicate) {
      showToast(`فردی با شماره ملی ${toPersianDigits(nid)} قبلاً در این شرکت ثبت شده است.`, 'error');
      setFormStep(1);
      return;
    }

    onSavePersonnel(editingPerson, sendForReview);

    if (quickAddAnother && !editingPerson.id) {
      setEditingPerson(createEmptyPersonnelRecord(activeCompany));
      setFormStep(1);
      showToast('پرونده قبلی ثبت شد؛ فرم برای ثبت پرسنل بعدی آماده است.');
    } else {
      setEditingPerson(null);
    }
  };

  const handleAddCompanySharedVehicle = (e) => {
    e.preventDefault();
    if (!newCompanyVeh.brandModel.trim() || !newCompanyVeh.plateNumber.trim()) {
      showToast('مدل خودرو و شماره پلاک الزامی است.', 'error');
      return;
    }
    setHrState((prev) => ({
      ...prev,
      companyVehicles: [
        {
          ...newCompanyVeh,
          id: 'cveh-' + Date.now(),
          companyId: activeCompany.id,
          companyName: activeCompany.name
        },
        ...(prev.companyVehicles || [])
      ]
    }));
    setNewCompanyVeh({ vehicleType: 'سواری', brandModel: '', color: '', plateNumber: '', ownerType: 'متعلق به شرکت', notes: '' });
    setShowSharedVehicleModal(false);
    showToast('خودرو سازمانی شرکت با موفقیت ثبت شد.');
  };

  const kpiCards = [
    { label: 'کل افراد ثبت‌شده', value: stats.total, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    { label: 'افراد فعال', value: stats.active, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { label: 'تمام‌وقت', value: stats.fullTime, color: 'text-indigo-700 bg-indigo-50 border-indigo-200' },
    { label: 'پاره‌وقت', value: stats.partTime, color: 'text-sky-700 bg-sky-50 border-sky-200' },
    { label: 'پروژه‌ای و مشاور', value: stats.projectOrConsult, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    { label: 'حضوری در مرکز', value: stats.onSite, color: 'text-teal-700 bg-teal-50 border-teal-200' },
    { label: 'دورکار / مجازی', value: stats.remote, color: 'text-slate-700 bg-slate-100 border-slate-200' },
    { label: 'دارای خودروی ثبت‌شده', value: stats.withVehicle, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { label: 'قرارداد نزدیک به پایان', value: stats.expiringContracts, color: 'text-rose-700 bg-rose-50 border-rose-200' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f294a]">
            مدیریت پرسنل، اعضای تیم و تردد خودرو
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ثبت پرونده پرسنلی کارکنان، قراردادها، شیوه حضور و خودروهای مجاز تردد به مرکز رشد
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            disabled={Boolean(lockedCompanyId)}
            value={selectedCompanyId}
            onChange={(e) => setSelectedCompanyId(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs font-bold"
          >
            {companies.map((c) => (
              <option key={c.id} value={c.id}>
                شرکت: {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowSharedVehicleModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-bold flex items-center gap-1.5"
          >
            <Car className="w-4 h-4 text-blue-600" />
            <span>خودروهای شرکت ({toPersianDigits(companySharedVehicles.length)})</span>
          </button>

          <button
            onClick={() => {
              setEditingPerson(createEmptyPersonnelRecord(activeCompany));
              setFormStep(1);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            <span>ثبت پرسنل جدید</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3">
        {kpiCards.map((c, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className={`text-xl font-extrabold px-2 py-0.5 rounded-lg border self-start mb-2 ${c.color}`}>
              {toPersianDigits(c.value)}
            </span>
            <span className="text-[11px] font-bold text-slate-700 leading-4">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو نام، کد ملی، سمت..."
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300"
          />
        </div>
        <select value={filterContract} onChange={(e) => setFilterContract(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">نوع قرارداد: همه</option>
          {HR_CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
        </select>
        <select value={filterAttendance} onChange={(e) => setFilterAttendance(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">وضعیت حضور: همه</option>
          {HR_ATTENDANCE_MODES.map((am) => <option key={am} value={am}>{am}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">وضعیت همکاری: همه</option>
          {HR_COOPERATION_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
        <input
          type="text"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          placeholder="فیلتر جایگاه شغلی..."
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3">ردیف</th>
                <th className="py-3.5 px-3">نام و نام خانوادگی</th>
                <th className="py-3.5 px-3">شماره ملی (ماسک‌شده)</th>
                <th className="py-3.5 px-3">جایگاه شغلی</th>
                <th className="py-3.5 px-3">نوع قرارداد</th>
                <th className="py-3.5 px-3">وضعیت حضور</th>
                <th className="py-3.5 px-3">وضعیت همکاری</th>
                <th className="py-3.5 px-3">تأیید مرکز رشد</th>
                <th className="py-3.5 px-3">شروع همکاری</th>
                <th className="py-3.5 px-3 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-10 text-center text-slate-400">
                    هیچ پرسنلی با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredPersonnel.map((person, idx) => (
                  <tr key={person.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3">{toPersianDigits(idx + 1)}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {person.firstName} {person.lastName}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600" dir="ltr">
                      {toPersianDigits(maskNationalId(person.nationalId))}
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{person.jobTitle}</div>
                      <span className="text-[11px] text-slate-400">{person.orgUnit}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{person.contractType}</div>
                      <span className="text-[11px] text-slate-400">{person.cooperationType}</span>
                    </td>
                    <td className="py-3.5 px-3">{person.attendanceMode}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          person.cooperationStatus === 'فعال'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {person.cooperationStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          person.reviewStatus === 'تأییدشده'
                            ? 'bg-blue-100 text-blue-800'
                            : person.reviewStatus === 'نیازمند اصلاح'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {person.reviewStatus}
                      </span>
                      {person.returnNote && (
                        <p className="text-[10px] text-rose-700 mt-1 max-w-[140px]">{person.returnNote}</p>
                      )}
                    </td>
                    <td className="py-3.5 px-3">{toPersianDigits(person.startDate)}</td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setViewingPerson(person)}
                          title="مشاهده پرونده کامل فرد"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingPerson(JSON.parse(JSON.stringify(person)));
                            setFormStep(1);
                          }}
                          title="ویرایش اطلاعات"
                          className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {person.cooperationStatus === 'فعال' ? (
                          <button
                            onClick={() => {
                              setExitModalPerson(person);
                              setExitDate(getTodayJalali());
                              setExitReason('');
                            }}
                            title="ثبت خروج فرد از شرکت"
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                          >
                            <UserMinus className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setRehireModalPerson(person);
                              setRehireStartDate(getTodayJalali());
                            }}
                            title="ثبت دوره همکاری جدید"
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* مودال ۵ مرحله‌ای ثبت / ویرایش پرونده پرسنل */}
      {editingPerson && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto text-xs">
            <div className="p-5 bg-[#0b1f3a] text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base">
                {editingPerson.id
                  ? `ویرایش پرونده پرسنلی: ${editingPerson.firstName} ${editingPerson.lastName}`
                  : `ثبت عضو جدید در تیم ${activeCompany.name}`}
              </h3>
              <button onClick={() => setEditingPerson(null)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100 px-4 pt-2 gap-1.5">
              {[
                { id: 1, label: '۱. اطلاعات هویتی' },
                { id: 2, label: '۲. شغلی و قرارداد' },
                { id: 3, label: '۳. وضعیت حضور و استقرار' },
                { id: 4, label: '۴. خودرو و تردد' },
                { id: 5, label: '۵. مدارک و مستندات' }
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFormStep(st.id)}
                  className={`px-3.5 py-2 rounded-t-xl font-bold whitespace-nowrap ${
                    formStep === st.id
                      ? 'bg-white text-[#0f294a] border-t border-x border-slate-200'
                      : 'text-slate-600'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-4">
              {formStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold mb-1">نام *</label>
                    <input type="text" value={editingPerson.firstName} onChange={(e) => setEditingPerson({ ...editingPerson, firstName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نام خانوادگی *</label>
                    <input type="text" value={editingPerson.lastName} onChange={(e) => setEditingPerson({ ...editingPerson, lastName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نام پدر</label>
                    <input type="text" value={editingPerson.fatherName} onChange={(e) => setEditingPerson({ ...editingPerson, fatherName: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">شماره ملی (شناسه یکتا ۱۰ رقمی) *</label>
                    <input type="text" dir="ltr" value={editingPerson.nationalId} onChange={(e) => setEditingPerson({ ...editingPerson, nationalId: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ تولد (شمسی)</label>
                    <input type="text" dir="ltr" placeholder="1370/05/12" value={editingPerson.birthDate} onChange={(e) => setEditingPerson({ ...editingPerson, birthDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">شماره تلفن همراه</label>
                    <input type="text" dir="ltr" value={editingPerson.mobile} onChange={(e) => setEditingPerson({ ...editingPerson, mobile: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ایمیل</label>
                    <input type="email" dir="ltr" value={editingPerson.email} onChange={(e) => setEditingPerson({ ...editingPerson, email: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">جنسیت</label>
                    <select value={editingPerson.gender} onChange={(e) => setEditingPerson({ ...editingPerson, gender: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      <option value="مرد">مرد</option>
                      <option value="زن">زن</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تصویر پرسنلی (اختیاری)</label>
                    <input type="file" accept="image/*" onChange={(e) => handleFileAttach(e.target.files?.[0], (f) => setEditingPerson({ ...editingPerson, avatarUrl: f.dataUrl }))} className="text-[11px]" />
                  </div>
                </div>
              )}

              {formStep === 2 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold mb-1">عنوان شغلی / جایگاه سازمانی *</label>
                    <input type="text" value={editingPerson.jobTitle} onChange={(e) => setEditingPerson({ ...editingPerson, jobTitle: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">واحد سازمانی</label>
                    <select value={editingPerson.orgUnit} onChange={(e) => setEditingPerson({ ...editingPerson, orgUnit: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      {HR_ORG_UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تخصص و حوزه فعالیت</label>
                    <input type="text" value={editingPerson.specialty} onChange={(e) => setEditingPerson({ ...editingPerson, specialty: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">مدرک تحصیلی</label>
                    <select value={editingPerson.degree} onChange={(e) => setEditingPerson({ ...editingPerson, degree: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      <option value="دیپلم و کاردانی">دیپلم و کاردانی</option>
                      <option value="کارشناسی">کارشناسی</option>
                      <option value="کارشناسی ارشد">کارشناسی ارشد</option>
                      <option value="دکتری تخصصی">دکتری تخصصی</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">رشته تحصیلی</label>
                    <input type="text" value={editingPerson.major} onChange={(e) => setEditingPerson({ ...editingPerson, major: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">سابقه کاری مرتبط (سال)</label>
                    <input type="number" min="0" value={editingPerson.experienceYears} onChange={(e) => setEditingPerson({ ...editingPerson, experienceYears: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نوع همکاری</label>
                    <select value={editingPerson.cooperationType} onChange={(e) => setEditingPerson({ ...editingPerson, cooperationType: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      {HR_COOPERATION_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">نوع قرارداد</label>
                    <select value={editingPerson.contractType} onChange={(e) => setEditingPerson({ ...editingPerson, contractType: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      {HR_CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">مدت قرارداد</label>
                    <input type="text" value={editingPerson.contractDuration} onChange={(e) => setEditingPerson({ ...editingPerson, contractDuration: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ شروع همکاری</label>
                    <input type="text" dir="ltr" value={editingPerson.startDate} onChange={(e) => setEditingPerson({ ...editingPerson, startDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ شروع قرارداد</label>
                    <input type="text" dir="ltr" value={editingPerson.contractStartDate} onChange={(e) => setEditingPerson({ ...editingPerson, contractStartDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تاریخ پایان قرارداد</label>
                    <input type="text" dir="ltr" value={editingPerson.contractEndDate} onChange={(e) => setEditingPerson({ ...editingPerson, contractEndDate: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                </div>
              )}

              {formStep === 3 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold mb-1">شیوه حضور و فعالیت</label>
                    <select value={editingPerson.attendanceMode} onChange={(e) => setEditingPerson({ ...editingPerson, attendanceMode: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      {HR_ATTENDANCE_MODES.map((am) => <option key={am} value={am}>{am}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">محل فعالیت فرد</label>
                    <select value={editingPerson.workLocation} onChange={(e) => setEditingPerson({ ...editingPerson, workLocation: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                      {HR_WORK_LOCATIONS.map((wl) => <option key={wl} value={wl}>{wl}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold mb-1">تعداد روزهای حضور در هفته</label>
                    <input type="number" min="0" max="7" value={editingPerson.weeklyPresenceDays} onChange={(e) => setEditingPerson({ ...editingPerson, weeklyPresenceDays: Number(e.target.value) })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div>
                    <label className="block font-bold mb-1">ساعات کاری معمول</label>
                    <input type="text" value={editingPerson.workingHours} onChange={(e) => setEditingPerson({ ...editingPerson, workingHours: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">روزهای حضور در مرکز رشد</label>
                    <input type="text" value={editingPerson.presenceDaysOfWeek} onChange={(e) => setEditingPerson({ ...editingPerson, presenceDaysOfWeek: e.target.value })} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block font-bold mb-1">توضیحات مربوط به نحوه فعالیت</label>
                    <textarea rows={2} value={editingPerson.activityNotes} onChange={(e) => setEditingPerson({ ...editingPerson, activityNotes: e.target.value })} className="w-full p-2.5 rounded-xl border border-slate-300" />
                  </div>
                </div>
              )}

              {formStep === 4 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingPerson.hasVehicle}
                        onChange={(e) => setEditingPerson({ ...editingPerson, hasVehicle: e.target.checked })}
                      />
                      <span>فرد برای رفت‌وآمد به مرکز رشد از خودرو استفاده می‌کند</span>
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        setEditingPerson({
                          ...editingPerson,
                          hasVehicle: true,
                          vehicles: [
                            ...(editingPerson.vehicles || []),
                            { id: 'veh-' + Date.now(), vehicleType: 'سواری', brandModel: '', color: '', plateNumber: '', ownerType: 'شخصی', notes: '' }
                          ]
                        })
                      }
                      className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>افزودن خودروی فرد</span>
                    </button>
                  </div>

                  {(editingPerson.vehicles || []).map((v, idx) => (
                    <div key={v.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingPerson({
                            ...editingPerson,
                            vehicles: editingPerson.vehicles.filter((_, i) => i !== idx)
                          })
                        }
                        className="absolute top-2 left-2 text-rose-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div>
                        <label className="block font-bold mb-1">نوع خودرو</label>
                        <select
                          value={v.vehicleType}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, vehicleType: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="سواری">سواری</option>
                          <option value="وانت / باری سبک">وانت / باری سبک</option>
                          <option value="موتورسیکلت">موتورسیکلت</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">شرکت سازنده و مدل خودرو</label>
                        <input
                          type="text"
                          value={v.brandModel}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, brandModel: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">رنگ خودرو</label>
                        <input
                          type="text"
                          value={v.color}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, color: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">شماره پلاک</label>
                        <input
                          type="text"
                          value={v.plateNumber}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, plateNumber: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block font-bold mb-1">مالک خودرو</label>
                        <select
                          value={v.ownerType}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, ownerType: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        >
                          <option value="شخصی">شخصی</option>
                          <option value="متعلق به شرکت">متعلق به شرکت</option>
                          <option value="سازمانی / اجاره‌ای">سازمانی / اجاره‌ای</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold mb-1">توضیحات تکمیلی</label>
                        <input
                          type="text"
                          value={v.notes}
                          onChange={(e) => {
                            const next = [...editingPerson.vehicles];
                            next[idx] = { ...v, notes: e.target.value };
                            setEditingPerson({ ...editingPerson, vehicles: next });
                          }}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white"
                        />
                      </div>
                    </div>
                  ))}

                  {companySharedVehicles.length > 0 && (
                    <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                      <span className="font-bold text-blue-950 block">
                        انتخاب از خودروهای مشترک ثبت‌شده برای شرکت (بدون ثبت مجدد):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {companySharedVehicles.map((cv) => {
                          const checked = (editingPerson.sharedCompanyVehicleIds || []).includes(cv.id);
                          return (
                            <label key={cv.id} className="px-3 py-1.5 rounded-xl bg-white border border-blue-200 flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const prevIds = editingPerson.sharedCompanyVehicleIds || [];
                                  const nextIds = e.target.checked
                                    ? [...prevIds, cv.id]
                                    : prevIds.filter((id) => id !== cv.id);
                                  setEditingPerson({
                                    ...editingPerson,
                                    hasVehicle: nextIds.length > 0 || (editingPerson.vehicles?.length || 0) > 0,
                                    sharedCompanyVehicleIds: nextIds
                                  });
                                }}
                              />
                              <span>{cv.brandModel} ({toPersianDigits(cv.plateNumber)})</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {formStep === 5 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: 'contractFile', label: 'تصویر قرارداد همکاری' },
                    { key: 'resumeFile', label: 'رزومه یا سوابق کاری' },
                    { key: 'educationFile', label: 'مدارک تحصیلی (اختیاری)' },
                    { key: 'nationalCardFile', label: 'تصویر کارت ملی (اختیاری)' },
                    { key: 'otherFile', label: 'سایر مستندات' }
                  ].map((doc) => {
                    const f = editingPerson.documents?.[doc.key];
                    return (
                      <div key={doc.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                        <span className="font-bold block">{doc.label}</span>
                        {f ? (
                          <div className="flex justify-between items-center bg-white px-2.5 py-1 rounded border border-emerald-200">
                            <span className="text-emerald-800 font-semibold truncate">{f.name}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingPerson({
                                  ...editingPerson,
                                  documents: { ...editingPerson.documents, [doc.key]: null }
                                })
                              }
                              className="text-rose-600"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,image/*"
                            onChange={(e) =>
                              handleFileAttach(e.target.files?.[0], (uploaded) =>
                                setEditingPerson({
                                  ...editingPerson,
                                  documents: { ...editingPerson.documents, [doc.key]: uploaded }
                                })
                              )
                            }
                            className="text-[11px]"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              {!editingPerson.id ? (
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={quickAddAnother}
                    onChange={(e) => setQuickAddAnother(e.target.checked)}
                  />
                  <span>افزودن سریع نفر بعدی بلافاصله پس از ثبت</span>
                </label>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setEditingPerson(null)} className="px-4 py-2 rounded-xl border border-slate-300 font-semibold">
                  انصراف
                </button>
                <button type="button" onClick={() => handleSaveForm(false)} className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold">
                  ذخیره پیش‌نویس
                </button>
                <button type="button" onClick={() => handleSaveForm(true)} className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold">
                  ثبت و ارسال به مرکز رشد
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال مشاهده پرونده کامل فرد */}
      {viewingPerson && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 text-xs my-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-base text-[#0f294a]">
                پرونده پرسنلی: {viewingPerson.firstName} {viewingPerson.lastName}
              </h4>
              <button onClick={() => setViewingPerson(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
              <div>نام پدر: <b>{viewingPerson.fatherName || '—'}</b></div>
              <div>شماره ملی: <b dir="ltr">{toPersianDigits(viewingPerson.nationalId)}</b></div>
              <div>موبایل: <b dir="ltr">{toPersianDigits(viewingPerson.mobile)}</b></div>
              <div>جایگاه شغلی: <b>{viewingPerson.jobTitle}</b></div>
              <div>واحد سازمانی: <b>{viewingPerson.orgUnit}</b></div>
              <div>تحصیلات: <b>{viewingPerson.degree} ({viewingPerson.major})</b></div>
              <div>نوع همکاری: <b>{viewingPerson.cooperationType}</b></div>
              <div>نوع قرارداد: <b>{viewingPerson.contractType}</b></div>
              <div>وضعیت حضور: <b>{viewingPerson.attendanceMode}</b></div>
            </div>
            <div>
              <span className="font-bold block mb-2">تاریخچه تغییرات و سوابق همکاری:</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto">
                {(viewingPerson.history || []).map((h) => (
                  <div key={h.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex justify-between">
                    <span>{h.action} ({h.user})</span>
                    <span dir="ltr" className="text-slate-400">{toPersianDigits(h.date)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* مودال ثبت خروج فرد */}
      {exitModalPerson && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="font-extrabold text-sm text-rose-800">
              ثبت خاتمه همکاری: {exitModalPerson.firstName} {exitModalPerson.lastName}
            </h4>
            <p className="text-slate-600">
              اطلاعات و سوابق قبلی فرد حذف نخواهد شد و وضعیت همکاری به «خاتمه همکاری» تغییر می‌یابد.
            </p>
            <div>
              <label className="block font-bold mb-1">تاریخ پایان همکاری (شمسی)</label>
              <input type="text" dir="ltr" value={exitDate} onChange={(e) => setExitDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="block font-bold mb-1">علت خاتمه همکاری (اختیاری)</label>
              <input type="text" value={exitReason} onChange={(e) => setExitReason(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setExitModalPerson(null)} className="px-4 py-2 rounded-xl border">انصراف</button>
              <button
                onClick={() => {
                  onStatusTransition(exitModalPerson.id, 'exit', { exitDate, exitReason });
                  setExitModalPerson(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
              >
                تأیید ثبت خروج
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال بازگشت مجدد به همکاری */}
      {rehireModalPerson && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="font-extrabold text-sm text-emerald-900">
              ثبت دوره همکاری جدید: {rehireModalPerson.firstName} {rehireModalPerson.lastName}
            </h4>
            <div>
              <label className="block font-bold mb-1">تاریخ شروع دوره جدید</label>
              <input type="text" dir="ltr" value={rehireStartDate} onChange={(e) => setRehireStartDate(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="block font-bold mb-1">نوع قرارداد جدید</label>
              <select value={rehireContractType} onChange={(e) => setRehireContractType(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white">
                {HR_CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
              </select>
            </div>
            <div>
              <label className="block font-bold mb-1">تاریخ پایان قرارداد جدید</label>
              <input type="text" dir="ltr" value={rehireContractEnd} onChange={(e) => setRehireContractEnd(e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300" />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRehireModalPerson(null)} className="px-4 py-2 rounded-xl border">انصراف</button>
              <button
                onClick={() => {
                  onStatusTransition(rehireModalPerson.id, 'rehire', {
                    newStartDate: rehireStartDate,
                    contractType: rehireContractType,
                    contractEndDate: rehireContractEnd
                  });
                  setRehireModalPerson(null);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
              >
                فعال‌سازی دوره جدید
              </button>
            </div>
          </div>
        </div>
      )}

      {/* مودال خودروهای متعلق به شرکت */}
      {showSharedVehicleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-3">
              <h4 className="font-extrabold text-sm text-[#0f294a]">
                خودروهای سازمانی متعلق به شرکت ({activeCompany.name})
              </h4>
              <button onClick={() => setShowSharedVehicleModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleAddCompanySharedVehicle} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl">
              <input
                type="text"
                placeholder="مدل خودرو (مثلاً: پژو ۲۰۷)"
                value={newCompanyVeh.brandModel}
                onChange={(e) => setNewCompanyVeh({ ...newCompanyVeh, brandModel: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <input
                type="text"
                placeholder="شماره پلاک"
                value={newCompanyVeh.plateNumber}
                onChange={(e) => setNewCompanyVeh({ ...newCompanyVeh, plateNumber: e.target.value })}
                className="px-3 py-2 rounded-lg border border-slate-300 bg-white"
              />
              <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold">
                افزودن خودروی شرکت
              </button>
            </form>

            <div className="space-y-2 max-h-52 overflow-y-auto">
              {companySharedVehicles.map((cv) => (
                <div key={cv.id} className="p-3 rounded-xl border border-slate-200 flex justify-between items-center">
                  <span><b>{cv.brandModel}</b> ({cv.ownerType})</span>
                  <span className="font-mono font-bold text-blue-900">{toPersianDigits(cv.plateNumber)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CenterHRManagementView({ companies, hrState, adminUser, onReviewPersonnel, showToast }) {
  const canReview = ['system_admin', 'org_manager', 'expert'].includes(adminUser?.secretariatRole);
  const canSeeSensitive = ['system_admin', 'org_manager', 'expert'].includes(adminUser?.secretariatRole);
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState('همه');
  const [statusFilter, setStatusFilter] = useState('همه');
  const [returnModalId, setReturnModalId] = useState(null);
  const [returnNoteText, setReturnNoteText] = useState('');

  const filteredList = (hrState.personnel || []).filter((p) => {
    if (selectedCompanyFilter !== 'همه' && p.companyId !== selectedCompanyFilter) return false;
    if (statusFilter !== 'همه' && p.reviewStatus !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f294a]">
          کارتابل مدیریت نیروی انسانی شرکت‌های عضو مرکز رشد
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          بررسی پرونده کارکنان هر شرکت، کنترل تردد خودروها، تأیید نهایی یا درخواست اصلاح
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        {companies.map((c) => {
          const count = (hrState.personnel || []).filter(
            (p) => p.companyId === c.id && p.cooperationStatus === 'فعال'
          ).length;
          return (
            <div
              key={c.id}
              onClick={() => setSelectedCompanyFilter(selectedCompanyFilter === c.id ? 'همه' : c.id)}
              className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedCompanyFilter === c.id
                  ? 'bg-blue-50 border-blue-400'
                  : 'bg-white border-slate-200 hover:border-blue-200'
              }`}
            >
              <div className="font-bold text-slate-900 truncate">{c.name}</div>
              <div className="text-slate-500 mt-1">
                پرسنل فعال ثبت‌شده: <b className="text-blue-800">{toPersianDigits(count)} نفر</b>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-wrap gap-3 text-xs">
        <select value={selectedCompanyFilter} onChange={(e) => setSelectedCompanyFilter(e.target.value)} className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">همه شرکت‌های عضو</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">همه وضعیت‌های بررسی</option>
          <option value="ارسال‌شده">ارسال‌شده (منتظر تأیید)</option>
          <option value="تأییدشده">تأییدشده</option>
          <option value="نیازمند اصلاح">نیازمند اصلاح</option>
          <option value="پیش‌نویس">پیش‌نویس</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-700 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-3">شرکت</th>
                <th className="py-3.5 px-3">نام و نام خانوادگی</th>
                <th className="py-3.5 px-3">شماره ملی / تماس</th>
                <th className="py-3.5 px-3">سمت و قرارداد</th>
                <th className="py-3.5 px-3">وضعیت حضور</th>
                <th className="py-3.5 px-3">پلاک خودرو</th>
                <th className="py-3.5 px-3">وضعیت پرونده</th>
                <th className="py-3.5 px-3 text-center">اقدام کارشناسی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((p) => {
                const plates = (p.vehicles || []).map((v) => v.plateNumber).filter(Boolean).join('، ');
                return (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="py-3.5 px-3 font-bold text-slate-800">{p.companyName}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">
                      {p.firstName} {p.lastName}
                    </td>
                    <td className="py-3.5 px-3 font-mono" dir="ltr">
                      <div>{canSeeSensitive ? toPersianDigits(p.nationalId) : toPersianDigits(maskNationalId(p.nationalId))}</div>
                      {canSeeSensitive && <span className="text-[11px] text-slate-400">{toPersianDigits(p.mobile)}</span>}
                    </td>
                    <td className="py-3.5 px-3">
                      <div>{p.jobTitle}</div>
                      <span className="text-[11px] text-slate-400">{p.contractType}</span>
                    </td>
                    <td className="py-3.5 px-3">{p.attendanceMode}</td>
                    <td className="py-3.5 px-3 font-mono">{toPersianDigits(plates) || '—'}</td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          p.reviewStatus === 'تأییدشده'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.reviewStatus === 'نیازمند اصلاح'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {p.reviewStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {canReview && (
                        <div className="flex justify-center gap-1.5">
                          <button
                            onClick={() => onReviewPersonnel(p.id, 'approve')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                          >
                            تأیید
                          </button>
                          <button
                            onClick={() => {
                              setReturnModalId(p.id);
                              setReturnNoteText('');
                            }}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-bold"
                          >
                            عودت اصلاح
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {returnModalId && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-xs">
            <h4 className="font-extrabold text-sm text-rose-900">درخواست اصلاح اطلاعات پرسنل از شرکت</h4>
            <textarea
              rows={3}
              value={returnNoteText}
              onChange={(e) => setReturnNoteText(e.target.value)}
              placeholder="موارد نیازمند اصلاح را وارد کنید..."
              className="w-full p-3 rounded-xl border border-slate-300"
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReturnModalId(null)} className="px-4 py-2 rounded-xl border">انصراف</button>
              <button
                onClick={() => {
                  if (!returnNoteText.trim()) {
                    showToast('درج توضیح اصلاح الزامی است.', 'error');
                    return;
                  }
                  onReviewPersonnel(returnModalId, 'return', returnNoteText);
                  setReturnModalId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
              >
                ارسال به کارتابل شرکت
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CenterHRReportsView({ companies, hrState, showToast }) {
  const [filterCompany, setFilterCompany] = useState('همه');
  const [filterContract, setFilterContract] = useState('همه');
  const [filterStatus, setFilterStatus] = useState('همه');
  const [filterAttendance, setFilterAttendance] = useState('همه');
  const [filterFromDate, setFilterFromDate] = useState('');

  const filteredPersonnel = useMemo(() => {
    return (hrState.personnel || []).filter((p) => {
      if (filterCompany !== 'همه' && p.companyId !== filterCompany) return false;
      if (filterContract !== 'همه' && p.contractType !== filterContract) return false;
      if (filterStatus !== 'همه' && p.cooperationStatus !== filterStatus) return false;
      if (filterAttendance !== 'همه' && p.attendanceMode !== filterAttendance) return false;
      if (filterFromDate.trim() && (p.startDate || '') < filterFromDate.trim()) return false;
      return true;
    });
  }, [hrState.personnel, filterCompany, filterContract, filterStatus, filterAttendance, filterFromDate]);

  const analytics = useMemo(() => {
    const active = filteredPersonnel.filter((p) => p.cooperationStatus === 'فعال');
    const exited = filteredPersonnel.filter((p) => p.cooperationStatus === 'خاتمه همکاری');
    const fullTime = active.filter((p) => p.cooperationType === 'تمام‌وقت').length;
    const partTime = active.filter((p) => p.cooperationType === 'پاره‌وقت').length;
    const onSite = active.filter((p) => p.attendanceMode === 'حضوری در محل شرکت').length;
    const remote = active.filter((p) => p.attendanceMode === 'دورکار / مجازی').length;
    const hybrid = active.filter((p) => p.attendanceMode === 'ترکیبی (حضوری و مجازی)').length;

    const personalVehicles = active.reduce((s, p) => s + (p.vehicles?.length || 0), 0);
    const companyVehicles = (hrState.companyVehicles || []).filter(
      (v) => filterCompany === 'همه' || v.companyId === filterCompany
    ).length;

    const byDegree = {};
    const byUnit = {};
    active.forEach((p) => {
      byDegree[p.degree || 'سایر'] = (byDegree[p.degree || 'سایر'] || 0) + 1;
      byUnit[p.orgUnit || 'سایر'] = (byUnit[p.orgUnit || 'سایر'] || 0) + 1;
    });

    return {
      total: filteredPersonnel.length,
      activeCount: active.length,
      exitedCount: exited.length,
      fullTime,
      partTime,
      onSite,
      remote,
      hybrid,
      personalVehicles,
      companyVehicles,
      totalVehicles: personalVehicles + companyVehicles,
      byDegree,
      byUnit
    };
  }, [filteredPersonnel, hrState.companyVehicles, filterCompany]);

  const handleExportExcel = () => {
    if (!window.XLSX) {
      showToast('کتابخانه اکسل در حال بارگذاری است؛ لطفاً لحظاتی دیگر تلاش کنید.', 'error');
      return;
    }
    const rows = filteredPersonnel.map((p, i) => ({
      'ردیف': i + 1,
      'شرکت': p.companyName,
      'نام و نام خانوادگی': `${p.firstName} ${p.lastName}`,
      'مدرک تحصیلی': p.degree,
      'رشته تحصیلی': p.major,
      'واحد سازمانی': p.orgUnit,
      'جایگاه شغلی': p.jobTitle,
      'نوع همکاری': p.cooperationType,
      'نوع قرارداد': p.contractType,
      'وضعیت حضور': p.attendanceMode,
      'وضعیت همکاری': p.cooperationStatus,
      'تاریخ شروع': p.startDate
    }));
    const ws = window.XLSX.utils.json_to_sheet(rows);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'گزارش نیروی انسانی');
    window.XLSX.writeFile(wb, 'Nokhbegan_HR_Report.xlsx');
    showToast('گزارش اکسل نیروی انسانی مرکز رشد دانلود شد.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f294a]">
            گزارش‌های مدیریتی و آماری نیروی انسانی مرکز رشد
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تحلیل آمار اشتغال، وضعیت حضور و تردد خودروها و تغییرات دوره‌ای شرکت‌ها
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportExcel} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5">
            <Download className="w-4 h-4" />
            <span>خروجی Excel</span>
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-[#0f294a] text-white text-xs font-bold flex items-center gap-1.5">
            <Printer className="w-4 h-4" />
            <span>چاپ / PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs no-print">
        <select value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">شرکت: همه شرکت‌ها</option>
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={filterContract} onChange={(e) => setFilterContract(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">نوع قرارداد: همه</option>
          {HR_CONTRACT_TYPES.map((ct) => <option key={ct} value={ct}>{ct}</option>)}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">وضعیت همکاری: همه</option>
          {HR_COOPERATION_STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
        </select>
        <select value={filterAttendance} onChange={(e) => setFilterAttendance(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50">
          <option value="همه">نوع حضور: همه</option>
          {HR_ATTENDANCE_MODES.map((am) => <option key={am} value={am}>{am}</option>)}
        </select>
        <input
          type="text"
          dir="ltr"
          placeholder="از تاریخ شروع (1404/01/01)"
          value={filterFromDate}
          onChange={(e) => setFilterFromDate(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 text-center">
        {[
          { label: 'کل پرسنل فیلترشده', val: analytics.total },
          { label: 'پرسنل فعال', val: analytics.activeCount },
          { label: 'تمام‌وقت / پاره‌وقت', val: `${analytics.fullTime} / ${analytics.partTime}` },
          { label: 'حضوری در مرکز', val: analytics.onSite },
          { label: 'دورکار / ترکیبی', val: `${analytics.remote} / ${analytics.hybrid}` },
          { label: 'کل خودروهای ثبت‌شده', val: analytics.totalVehicles },
          { label: 'خودرو شخصی / شرکتی', val: `${analytics.personalVehicles} / ${analytics.companyVehicles}` },
          { label: 'خاتمه همکاری (خروج)', val: analytics.exitedCount }
        ].map((item, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
            <span className="text-lg font-extrabold text-[#0f294a] block mb-1">{toPersianDigits(item.val)}</span>
            <span className="text-[11px] text-slate-500">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <h3 className="font-bold text-sm text-slate-900">توزیع نیروی انسانی بر اساس مدرک تحصیلی</h3>
          {Object.entries(analytics.byDegree).map(([deg, cnt]) => (
            <div key={deg} className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>{deg}</span>
              <b>{toPersianDigits(cnt)} نفر</b>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 space-y-3">
          <h3 className="font-bold text-sm text-slate-900">توزیع نیروی انسانی بر اساس واحد و حوزه شغلی</h3>
          {Object.entries(analytics.byUnit).map(([unit, cnt]) => (
            <div key={unit} className="flex justify-between p-2.5 rounded-xl bg-slate-50">
              <span>{unit}</span>
              <b>{toPersianDigits(cnt)} نفر</b>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ۸. ماژول تبدیل وضعیت شرکت (پیش‌رشد به رشد)
// ============================================================================
function CompanyUpgradePortalView({ companies, upgradeState, adminUser, onSaveRequest, showToast }) {
  const lockedCompanyId = adminUser?.secretariatRole === 'company_rep' ? adminUser.companyId || 'comp-4' : null;
  const [selectedCompanyId, setSelectedCompanyId] = useState(lockedCompanyId || 'comp-4');
  const company = companies.find((c) => c.id === selectedCompanyId) || companies[0];
  const [step, setStep] = useState(1);

  const existingReq = upgradeState.requests.find((r) => r.companyId === selectedCompanyId);
  const [reqData, setReqData] = useState(() =>
    existingReq || {
      id: 'upg-' + Date.now(),
      companyId: company?.id,
      companyName: company?.name,
      status: 'در حال تکمیل',
      startedAt: getNowJalaliDateTime(),
      sectionRemarks: {},
      section1: {
        fullCompanyName: company?.name || '',
        legalType: company?.companyType || 'سهامی خاص',
        nationalId: company?.nationalId || '',
        registrationNumber: company?.registrationNumber || '',
        registrationDate: company?.establishedDate || '',
        headquartersAddress: company?.unitNumber || '',
        ceoName: company?.ceoName || '',
        phone: company?.ceoPhone || '',
        email: company?.email || '',
        shareholders: [{ name: company?.ceoName || '', sharePercent: 100, role: 'مدیرعامل' }]
      },
      section2: { reportText: '', attachments: [] },
      section3: {
        customerSegments: '',
        valuePropositions: '',
        channels: '',
        customerRelationships: '',
        revenueStreams: '',
        keyResources: '',
        keyActivities: '',
        keyPartners: '',
        costStructure: ''
      },
      section4: {
        overview: '',
        targetMarket: '',
        forecastSales: '',
        forecastCustomers: '',
        forecastContracts: '',
        quarters: {
          q1: { actions: '', output: '', kpi: '' },
          q2: { actions: '', output: '', kpi: '' },
          q3: { actions: '', output: '', kpi: '' },
          q4: { actions: '', output: '', kpi: '' }
        }
      },
      section5: { contracts: [] },
      history: []
    }
  );

  useEffect(() => {
    const found = upgradeState.requests.find((r) => r.companyId === selectedCompanyId);
    if (found) setReqData(found);
  }, [selectedCompanyId, upgradeState.requests]);

  const totalContractAmount = (reqData.section5?.contracts || []).reduce((s, c) => s + (Number(c.contractAmount) || 0), 0);
  const totalRealizedSales = (reqData.section5?.contracts || []).reduce((s, c) => s + (Number(c.realizedSales) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">
            درخواست تبدیل وضعیت از پیش‌رشد به رشد
          </h1>
          <p className="text-slate-500 mt-1">وضعیت فعلی پرونده: <b className="text-blue-800">{reqData.status}</b></p>
        </div>
        <select
          disabled={Boolean(lockedCompanyId)}
          value={selectedCompanyId}
          onChange={(e) => setSelectedCompanyId(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white font-bold"
        >
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex overflow-x-auto border-b bg-slate-50 px-4 pt-2 gap-1">
          {[
            { id: 1, label: '۱. اطلاعات ثبتی و سهامداران' },
            { id: 2, label: '۲. گزارش پیشرفت فنی' },
            { id: 3, label: '۳. بوم مدل کسب‌وکار (۹ بخش)' },
            { id: 4, label: '۴. برنامه یک‌ساله تجاری‌سازی' },
            { id: 5, label: '۵. قراردادهای فروش' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setStep(t.id)}
              className={`px-3.5 py-2.5 rounded-t-xl font-bold whitespace-nowrap ${
                step === t.id ? 'bg-white text-[#0f294a] border-t border-x' : 'text-slate-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-4">
          {reqData.sectionRemarks?.[`section${step}`] && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-semibold">
              توضیح اصلاحی کارشناس مرکز رشد برای این بخش: {reqData.sectionRemarks[`section${step}`]}
            </div>
          )}

          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold mb-1">نام کامل شرکت</label>
                <input type="text" value={reqData.section1.fullCompanyName} onChange={(e) => setReqData({ ...reqData, section1: { ...reqData.section1, fullCompanyName: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
              </div>
              <div>
                <label className="block font-bold mb-1">شناسه ملی</label>
                <input type="text" dir="ltr" value={reqData.section1.nationalId} onChange={(e) => setReqData({ ...reqData, section1: { ...reqData.section1, nationalId: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
              </div>
              <div>
                <label className="block font-bold mb-1">شماره ثبت</label>
                <input type="text" dir="ltr" value={reqData.section1.registrationNumber} onChange={(e) => setReqData({ ...reqData, section1: { ...reqData.section1, registrationNumber: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <label className="block font-bold mb-1">گزارش جامع پیشرفت فنی ایده محوری</label>
              <textarea
                rows={7}
                value={reqData.section2.reportText}
                onChange={(e) => setReqData({ ...reqData, section2: { ...reqData.section2, reportText: e.target.value } })}
                className="w-full p-3 rounded-xl border leading-6"
              />
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { key: 'keyPartners', title: '۸. شرکای کلیدی' },
                { key: 'keyActivities', title: '۷. فعالیت‌های کلیدی' },
                { key: 'valuePropositions', title: '۲. ارزش پیشنهادی' },
                { key: 'customerRelationships', title: '۴. ارتباط با مشتریان' },
                { key: 'customerSegments', title: '۱. بخش‌های مشتریان' },
                { key: 'keyResources', title: '۶. منابع کلیدی' },
                { key: 'channels', title: '۳. کانال‌های توزیع' },
                { key: 'costStructure', title: '۹. ساختار هزینه‌ها' },
                { key: 'revenueStreams', title: '۵. جریان‌های درآمدی' }
              ].map((box) => (
                <div key={box.key} className="p-3 rounded-xl bg-slate-50 border">
                  <label className="block font-bold text-blue-900 mb-1">{box.title}</label>
                  <textarea
                    rows={3}
                    value={reqData.section3[box.key]}
                    onChange={(e) => setReqData({ ...reqData, section3: { ...reqData.section3, [box.key]: e.target.value } })}
                    className="w-full p-2 rounded-lg border bg-white"
                  />
                </div>
              ))}
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold mb-1">شرح کلی برنامه یک‌ساله تجاری‌سازی</label>
                <textarea rows={3} value={reqData.section4.overview} onChange={(e) => setReqData({ ...reqData, section4: { ...reqData.section4, overview: e.target.value } })} className="w-full p-3 rounded-xl border" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">پیش‌بینی فروش سال آینده (ریال)</label>
                  <input type="text" dir="ltr" value={reqData.section4.forecastSales} onChange={(e) => setReqData({ ...reqData, section4: { ...reqData.section4, forecastSales: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
                </div>
                <div>
                  <label className="block font-bold mb-1">پیش‌بینی تعداد مشتریان</label>
                  <input type="text" dir="ltr" value={reqData.section4.forecastCustomers} onChange={(e) => setReqData({ ...reqData, section4: { ...reqData.section4, forecastCustomers: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
                </div>
                <div>
                  <label className="block font-bold mb-1">پیش‌بینی قراردادهای فروش</label>
                  <input type="text" dir="ltr" value={reqData.section4.forecastContracts} onChange={(e) => setReqData({ ...reqData, section4: { ...reqData.section4, forecastContracts: e.target.value } })} className="w-full px-3 py-2 rounded-xl border" />
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <button
                type="button"
                onClick={() =>
                  setReqData({
                    ...reqData,
                    section5: {
                      contracts: [
                        ...(reqData.section5.contracts || []),
                        { id: 'cnt-' + Date.now(), productName: '', clientOrg: '', contractAmount: 0, realizedSales: 0, status: 'در حال اجرا' }
                      ]
                    }
                  })
                }
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white font-bold"
              >
                + افزودن قرارداد فروش
              </button>

              {(reqData.section5.contracts || []).map((cnt, idx) => (
                <div key={cnt.id} className="p-4 rounded-xl bg-slate-50 border grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    placeholder="نام محصول / خدمت"
                    value={cnt.productName}
                    onChange={(e) => {
                      const next = [...reqData.section5.contracts];
                      next[idx] = { ...cnt, productName: e.target.value };
                      setReqData({ ...reqData, section5: { contracts: next } });
                    }}
                    className="px-3 py-2 rounded-lg border bg-white"
                  />
                  <input
                    type="text"
                    placeholder="سازمان طرف قرارداد"
                    value={cnt.clientOrg}
                    onChange={(e) => {
                      const next = [...reqData.section5.contracts];
                      next[idx] = { ...cnt, clientOrg: e.target.value };
                      setReqData({ ...reqData, section5: { contracts: next } });
                    }}
                    className="px-3 py-2 rounded-lg border bg-white"
                  />
                  <input
                    type="number"
                    placeholder="مبلغ قرارداد (ریال)"
                    value={cnt.contractAmount}
                    onChange={(e) => {
                      const next = [...reqData.section5.contracts];
                      next[idx] = { ...cnt, contractAmount: Number(e.target.value) };
                      setReqData({ ...reqData, section5: { contracts: next } });
                    }}
                    className="px-3 py-2 rounded-lg border bg-white"
                  />
                  <input
                    type="number"
                    placeholder="فروش تحقق‌یافته (ریال)"
                    value={cnt.realizedSales}
                    onChange={(e) => {
                      const next = [...reqData.section5.contracts];
                      next[idx] = { ...cnt, realizedSales: Number(e.target.value) };
                      setReqData({ ...reqData, section5: { contracts: next } });
                    }}
                    className="px-3 py-2 rounded-lg border bg-white"
                  />
                </div>
              ))}

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-wrap gap-6 font-bold text-blue-950">
                <span>تعداد کل قراردادها: {toPersianDigits(reqData.section5.contracts.length)}</span>
                <span>مجموع مبلغ قراردادها: {toPersianDigits(totalContractAmount.toLocaleString())} ریال</span>
                <span>مجموع فروش تحقق‌یافته: {toPersianDigits(totalRealizedSales.toLocaleString())} ریال</span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end gap-2">
            <button onClick={() => onSaveRequest(reqData, false)} className="px-4 py-2 rounded-xl bg-slate-200 font-bold">
              ذخیره پیش‌نویس
            </button>
            <button onClick={() => onSaveRequest(reqData, true)} className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
              تأیید نهایی و ارسال به مرکز رشد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CenterUpgradeInboxView({ upgradeState, onReturnRequest, onApproveRequest }) {
  const [selectedReqId, setSelectedReqId] = useState(null);
  const [internalNote, setInternalNote] = useState('');
  const [returnNote, setReturnNote] = useState('');
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  const selectedReq = upgradeState.requests.find((r) => r.id === selectedReqId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <h1 className="text-xl font-extrabold text-[#0f294a]">کارتابل درخواست‌های تبدیل وضعیت (پیش‌رشد به رشد)</h1>
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="py-3 px-4">نام شرکت</th>
              <th className="py-3 px-4">تاریخ ارسال</th>
              <th className="py-3 px-4">وضعیت درخواست</th>
              <th className="py-3 px-4">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {upgradeState.requests.map((r) => (
              <tr key={r.id}>
                <td className="py-3 px-4 font-bold">{r.companyName}</td>
                <td className="py-3 px-4">{toPersianDigits(r.submittedAt || r.startedAt)}</td>
                <td className="py-3 px-4">{r.status}</td>
                <td className="py-3 px-4">
                  <button onClick={() => setSelectedReqId(r.id)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold">
                    بررسی پرونده
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedReq && (
        <div className="bg-white rounded-2xl p-6 border border-blue-200 space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-bold text-base">بررسی پرونده تبدیل وضعیت: {selectedReq.companyName}</h3>
            <button onClick={() => setSelectedReqId(null)}><X className="w-5 h-5" /></button>
          </div>
          <p className="bg-slate-50 p-3 rounded-xl leading-6">{selectedReq.section2?.reportText}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" placeholder="یادداشت داخلی کارشناسی..." value={internalNote} onChange={(e) => setInternalNote(e.target.value)} className="px-3 py-2 rounded-xl border" />
            <input type="text" placeholder="توضیح عودت جهت اصلاح به شرکت..." value={returnNote} onChange={(e) => setReturnNote(e.target.value)} className="px-3 py-2 rounded-xl border" />
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => {
                onReturnRequest(selectedReq.id, { section2: returnNote }, internalNote);
                setSelectedReqId(null);
              }}
              className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold"
            >
              عودت برای اصلاح
            </button>
            <button
              onClick={() => setShowApproveConfirmModal(true)}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold"
            >
              تأیید نهایی و تبدیل به رشد
            </button>
          </div>
        </div>
      )}

      {showApproveConfirmModal && selectedReq && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="font-extrabold text-sm">تأیید نهایی ارتقاء وضعیت به دوره رشد</h4>
            <p className="text-slate-600">
              با تأیید نهایی، وضعیت شرکت «{selectedReq.companyName}» در کل سامانه به «دوره رشد» تغییر خواهد کرد.
            </p>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowApproveConfirmModal(false)} className="px-4 py-2 rounded-xl border font-semibold">
                انصراف
              </button>
              <button
                type="button"
                onClick={() => {
                  onApproveRequest(selectedReq.id, internalNote);
                  setShowApproveConfirmModal(false);
                  setSelectedReqId(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
              >
                بله، تأیید نهایی و ارتقا به رشد
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ۹. ماژول مدیریت اموال و تجهیزات تحویلی به شرکت‌ها
// ============================================================================
function AssetsDashboardView({ assetStats, onNavigate }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <h1 className="text-xl font-extrabold text-[#0f294a]">داشبورد مدیریت اموال و تجهیزات مرکز رشد</h1>
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'کل اقلام ثبت‌شده', val: assetStats.totalRegistered },
          { label: 'موجودی تحویل‌شده فعلی', val: assetStats.totalDelivered },
          { label: 'در انتظار تأیید شرکت', val: assetStats.pendingConfirm },
          { label: 'اقلام مستردشده', val: assetStats.totalReturned },
          { label: 'دارای مغایرت', val: assetStats.discrepancyCount },
          { label: 'شرکت‌های دارای اموال', val: assetStats.companiesWithAssets }
        ].map((c, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <span className="text-2xl font-extrabold text-[#0f294a] block mb-1">{toPersianDigits(c.val)}</span>
            <span className="text-xs text-slate-600">{c.label}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-xs">
        <button onClick={() => onNavigate('ast_manage')} className="px-4 py-2.5 rounded-xl bg-[#0f294a] text-white font-bold">
          ثبت تحویل یا تغییر تعداد اموال
        </button>
        <button onClick={() => onNavigate('ast_minutes')} className="px-4 py-2.5 rounded-xl bg-blue-600 text-white font-bold">
          صدور صورت‌جلسه تحویل و تحول
        </button>
      </div>
    </div>
  );
}

function AssetsManagementView({ companies, assetsState, setAssetsState, adminUser, showToast }) {
  const [companyId, setCompanyId] = useState(companies[0]?.id || 'comp-1');
  const [itemName, setItemName] = useState(DEFAULT_ASSET_ITEMS[0]);
  const [customItemName, setCustomItemName] = useState('');
  const [assetCode, setAssetCode] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [eventModalAsset, setEventModalAsset] = useState(null);
  const [eventType, setEventType] = useState('تحویل تکمیلی');
  const [eventDelta, setEventDelta] = useState(1);
  const [eventReason, setEventReason] = useState('');

  const handleAddAsset = (e) => {
    e.preventDefault();
    const comp = companies.find((c) => c.id === companyId);
    const finalName = itemName === 'سایر تجهیزات' && customItemName.trim() ? customItemName.trim() : itemName;
    const newItem = {
      id: 'ast-' + Date.now(),
      companyId,
      companyName: comp?.name || '',
      itemName: finalName,
      assetCode,
      category: 'تجهیزات اداری',
      physicalCondition: 'سالم',
      deliveryDate: getTodayJalali(),
      deliveredBy: adminUser.name,
      receivedBy: comp?.ceoName || '',
      confirmationStatus: 'ارسال‌شده برای تأیید شرکت',
      events: [
        {
          id: 'ev-' + Date.now(),
          type: 'تحویل اولیه',
          quantityDelta: Number(quantity) || 1,
          date: getTodayJalali(),
          user: adminUser.name,
          reason: 'تحویل اولیه اموال'
        }
      ]
    };
    setAssetsState((prev) => ({ ...prev, items: [newItem, ...prev.items] }));
    setAssetCode('');
    setCustomItemName('');
    showToast('قلم اموال ثبت و برای تأیید الکترونیکی شرکت ارسال شد.');
  };

  const handleRecordEvent = () => {
    if (!eventReason.trim()) {
      showToast('ثبت دلیل تغییر اموال الزامی است.', 'error');
      return;
    }
    const isDecrease = ['استرداد به مرکز رشد', 'ثبت کسری', 'ثبت خرابی', 'ثبت مفقودی'].includes(eventType);
    const signedDelta = isDecrease ? -Math.abs(Number(eventDelta)) : Math.abs(Number(eventDelta));

    setAssetsState((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === eventModalAsset.id
          ? {
              ...it,
              confirmationStatus: 'ارسال‌شده برای تأیید شرکت',
              events: [
                ...(it.events || []),
                {
                  id: 'ev-' + Date.now(),
                  type: eventType,
                  quantityDelta: signedDelta,
                  date: getTodayJalali(),
                  user: adminUser.name,
                  reason: eventReason
                }
              ]
            }
          : it
      )
    }));
    setEventModalAsset(null);
    setEventReason('');
    showToast('رویداد تغییر تعداد اموال با حفظ سابقه ثبت شد.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <form onSubmit={handleAddAsset} className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-base font-bold text-[#0f294a]">ثبت تحویل اولیه اموال و تجهیزات به شرکت</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <select value={companyId} onChange={(e) => setCompanyId(e.target.value)} className="px-3 py-2 rounded-xl border bg-white">
            {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={itemName} onChange={(e) => setItemName(e.target.value)} className="px-3 py-2 rounded-xl border bg-white">
            {DEFAULT_ASSET_ITEMS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          {itemName === 'سایر تجهیزات' && (
            <input type="text" placeholder="نام تجهیز جدید..." value={customItemName} onChange={(e) => setCustomItemName(e.target.value)} className="px-3 py-2 rounded-xl border" />
          )}
          <input type="text" placeholder="کد اموال / سریال" value={assetCode} onChange={(e) => setAssetCode(e.target.value)} className="px-3 py-2 rounded-xl border" />
          <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="px-3 py-2 rounded-xl border" />
        </div>
        <button type="submit" className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold">
          ثبت و ارسال برای تأیید شرکت
        </button>
      </form>

      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="py-3 px-4">شرکت</th>
              <th className="py-3 px-4">نام قلم</th>
              <th className="py-3 px-4">موجودی فعلی</th>
              <th className="py-3 px-4">وضعیت تأیید</th>
              <th className="py-3 px-4">افزایش / استرداد</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {assetsState.items.map((it) => {
              const q = computeAssetQuantities(it);
              return (
                <tr key={it.id}>
                  <td className="py-3 px-4 font-bold">{it.companyName}</td>
                  <td className="py-3 px-4">{it.itemName} ({toPersianDigits(it.assetCode || '-')})</td>
                  <td className="py-3 px-4 font-extrabold text-blue-900">{toPersianDigits(q.currentQty)}</td>
                  <td className="py-3 px-4">{it.confirmationStatus}</td>
                  <td className="py-3 px-4">
                    <button onClick={() => setEventModalAsset(it)} className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold">
                      ثبت افزایش / استرداد
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {eventModalAsset && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="font-bold text-sm">ثبت رویداد تغییر تعداد: {eventModalAsset.itemName}</h4>
            <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
              <option value="تحویل تکمیلی">تحویل تکمیلی (+)</option>
              <option value="استرداد به مرکز رشد">استرداد به مرکز رشد (-)</option>
              <option value="ثبت خرابی">ثبت خرابی (-)</option>
              <option value="ثبت کسری">ثبت کسری (-)</option>
            </select>
            <input type="number" min="1" value={eventDelta} onChange={(e) => setEventDelta(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            <input type="text" placeholder="دلیل تغییر (الزامی)..." value={eventReason} onChange={(e) => setEventReason(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setEventModalAsset(null)} className="px-4 py-2 rounded-xl border">انصراف</button>
              <button onClick={handleRecordEvent} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">ثبت رویداد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompanyAssetConfirmationView({ companies, assetsState, setAssetsState, adminUser, showToast }) {
  const [selectedCompId, setSelectedCompId] = useState(companies[0]?.id || 'comp-1');
  const [discrepancyNotes, setDiscrepancyNotes] = useState({});
  const compItems = assetsState.items.filter((it) => it.companyId === selectedCompId);

  const handleConfirmItem = (itemId, isOk) => {
    setAssetsState((prev) => ({
      ...prev,
      items: prev.items.map((it) =>
        it.id === itemId
          ? {
              ...it,
              confirmationStatus: isOk ? 'تأییدشده توسط شرکت' : 'دارای مغایرت',
              companyConfirmation: {
                confirmedBy: adminUser.name,
                date: getNowJalaliDateTime(),
                discrepancyNote: isOk ? '' : discrepancyNotes[itemId] || 'مغایرت اعلام شد'
              }
            }
          : it
      )
    }));
    showToast(isOk ? 'دریافت قلم اموال تأیید الکترونیکی شد.' : 'مغایرت ثبت و به کارشناس مرکز رشد اعلام شد.');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-[#0f294a]">کارتابل تأیید الکترونیکی اموال تحویلی (پنل شرکت)</h1>
        <select value={selectedCompId} onChange={(e) => setSelectedCompId(e.target.value)} className="px-3.5 py-2 rounded-xl border bg-white font-bold">
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div className="space-y-3">
        {compItems.map((it) => {
          const q = computeAssetQuantities(it);
          return (
            <div key={it.id} className="bg-white rounded-2xl p-5 border border-slate-200 flex flex-wrap justify-between items-center gap-4">
              <div>
                <h4 className="font-bold text-sm">{it.itemName} — تعداد فعلی: {toPersianDigits(q.currentQty)}</h4>
                <p className="text-slate-500 mt-1">وضعیت فعلی: <b>{it.confirmationStatus}</b></p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="توضیح در صورت مغایرت..."
                  value={discrepancyNotes[it.id] || ''}
                  onChange={(e) => setDiscrepancyNotes({ ...discrepancyNotes, [it.id]: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border"
                />
                <button onClick={() => handleConfirmItem(it.id, true)} className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
                  تأیید دریافت
                </button>
                <button onClick={() => handleConfirmItem(it.id, false)} className="px-3.5 py-2 rounded-xl bg-rose-600 text-white font-bold">
                  اعلام مغایرت
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AssetMinutesView({ companies, assetsState, settings, showToast }) {
  const [selectedCompId, setSelectedCompId] = useState(companies[0]?.id || 'comp-1');
  const comp = companies.find((c) => c.id === selectedCompId);
  const compAssets = assetsState.items.filter((it) => it.companyId === selectedCompId);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <div className="flex flex-wrap justify-between items-center gap-3 no-print">
        <select value={selectedCompId} onChange={(e) => setSelectedCompId(e.target.value)} className="px-3.5 py-2 rounded-xl border bg-white font-bold">
          {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <div className="flex gap-2">
          <button
            onClick={() => {
              exportAssetMinutesToDocx(comp, compAssets, settings);
              showToast('صورت‌جلسه اموال با فرمت Word (.docx) دانلود شد.');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold"
          >
            دریافت فایل Word (.docx)
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 rounded-xl bg-[#0f294a] text-white font-bold">
            چاپ / PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 space-y-6">
        <div className="text-center border-b pb-4">
          <h2 className="text-lg font-extrabold">{settings.orgHeader}</h2>
          <p className="text-sm font-bold mt-1">صورت‌جلسه رسمی تحویل و تحول اموال و تجهیزات — شرکت {comp?.name}</p>
        </div>
        <table className="w-full text-right border">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="p-2.5 border-l">ردیف</th>
              <th className="p-2.5 border-l">نام قلم</th>
              <th className="p-2.5 border-l">کد اموال</th>
              <th className="p-2.5 border-l">موجودی فعلی</th>
              <th className="p-2.5">وضعیت</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {compAssets.map((it, idx) => (
              <tr key={it.id}>
                <td className="p-2.5 border-l">{toPersianDigits(idx + 1)}</td>
                <td className="p-2.5 border-l font-bold">{it.itemName}</td>
                <td className="p-2.5 border-l">{toPersianDigits(it.assetCode || '—')}</td>
                <td className="p-2.5 border-l font-bold">{toPersianDigits(computeAssetQuantities(it).currentQty)}</td>
                <td className="p-2.5">{it.confirmationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AssetsAggregateReportView({ assetsState, showToast }) {
  const summaryByItem = useMemo(() => {
    const map = {};
    assetsState.items.forEach((it) => {
      const q = computeAssetQuantities(it);
      map[it.itemName] = (map[it.itemName] || 0) + q.currentQty;
    });
    return map;
  }, [assetsState.items]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-[#0f294a]">گزارش تجمیعی اموال مرکز رشد</h1>
        <button
          onClick={() => {
            if (!window.XLSX) {
              showToast('کتابخانه اکسل در حال بارگذاری است؛ لطفاً لحظاتی دیگر تلاش کنید.', 'error');
              return;
            }
            const ws = window.XLSX.utils.json_to_sheet(
              assetsState.items.map((it) => ({
                'شرکت': it.companyName,
                'نام قلم': it.itemName,
                'کد اموال': it.assetCode,
                'موجودی فعلی': computeAssetQuantities(it).currentQty,
                'وضعیت تأیید': it.confirmationStatus
              }))
            );
            const wb = window.XLSX.utils.book_new();
            window.XLSX.utils.book_append_sheet(wb, ws, 'اموال مرکز رشد');
            window.XLSX.writeFile(wb, 'Assets_Report.xlsx');
            showToast('فایل اکسل گزارش اموال دانلود شد.');
          }}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold"
        >
          خروجی Excel
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {Object.entries(summaryByItem).map(([name, qty]) => (
          <div key={name} className="bg-white rounded-2xl p-5 border border-slate-200">
            <span className="text-2xl font-extrabold text-blue-900 block mb-1">{toPersianDigits(qty)}</span>
            <span className="font-bold text-slate-700">مجموع {name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// ۱۰. ماژول دبیرخانه الکترونیکی (مکاتبات، دفتر اندیکاتور، Word و گردش کار)
// ============================================================================
function SecretariatModuleView({ subSection, secretariat, setSecretariat, secStats, adminUser, onNavigate, showToast }) {
  const [letterDirection, setLetterDirection] = useState('incoming');
  const [subject, setSubject] = useState('');
  const [partyOrg, setPartyOrg] = useState('');
  const [partyPerson, setPartyPerson] = useState('');
  const [senderLetterNo, setSenderLetterNo] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [signerName, setSignerName] = useState('دکتر حمیدرضا رضایی');
  const [signerTitle, setSignerTitle] = useState('رئیس مرکز رشد فناوری نخبگان');
  const [copies, setCopies] = useState('');
  const [referModalLetter, setReferModalLetter] = useState(null);
  const [referTo, setReferTo] = useState('کارشناس ارزیابی');
  const [referType, setReferType] = useState(REFERRAL_TYPES[0]);
  const [referNote, setReferNote] = useState('');

  const registerLetter = (asDraft = false) => {
    if (!subject.trim()) {
      showToast('موضوع نامه الزامی است.', 'error');
      return;
    }
    const isInc = letterDirection === 'incoming';
    const seq = isInc ? secretariat.settings.nextIncomingSeq : secretariat.settings.nextOutgoingSeq;
    const prefix = isInc ? secretariat.settings.incomingPrefix : secretariat.settings.outgoingPrefix;
    const indicatorNumber = asDraft ? '' : `${prefix}${toPersianDigits(seq)}`;

    const newLetter = {
      id: 'let-' + Date.now(),
      direction: letterDirection,
      indicatorNumber,
      senderLetterNumber: senderLetterNo,
      letterDate: getTodayJalali(),
      receivedDate: getTodayJalali(),
      senderName: isInc ? partyPerson : '',
      senderOrg: isInc ? partyOrg : '',
      recipientOrg: !isInc ? partyOrg : '',
      recipientPerson: !isInc ? partyPerson : '',
      subject,
      summary: bodyText,
      body: bodyText,
      signerName,
      signerTitle,
      copies,
      confidentiality: 'عادی',
      status: asDraft ? 'پیش‌نویس' : isInc ? 'در انتظار ارجاع' : 'ثبت نهایی و ارسال‌شده',
      isDraft: asDraft,
      isDeleted: false,
      referrals: [],
      versions: [{ version: 1, date: getNowJalaliDateTime(), user: adminUser.name, note: asDraft ? 'ذخیره پیش‌نویس' : 'ثبت نهایی' }]
    };

    setSecretariat((prev) => ({
      ...prev,
      settings: asDraft
        ? prev.settings
        : {
            ...prev.settings,
            nextIncomingSeq: isInc ? prev.settings.nextIncomingSeq + 1 : prev.settings.nextIncomingSeq,
            nextOutgoingSeq: !isInc ? prev.settings.nextOutgoingSeq + 1 : prev.settings.nextOutgoingSeq
          },
      letters: [newLetter, ...prev.letters],
      auditLogs: [
        {
          id: 'al-' + Date.now(),
          date: getNowJalaliDateTime(),
          user: adminUser.name,
          action: asDraft ? `ذخیره پیش‌نویس: ${subject}` : `ثبت نامه با شماره اندیکاتور ${indicatorNumber}`
        },
        ...prev.auditLogs
      ]
    }));

    setSubject('');
    setPartyOrg('');
    setPartyPerson('');
    setBodyText('');
    showToast(asDraft ? 'نامه به‌صورت پیش‌نویس ذخیره شد.' : `نامه با شماره اندیکاتور ${indicatorNumber} ثبت شد.`);
    onNavigate(asDraft ? 'sec_drafts' : isInc ? 'sec_incoming' : 'sec_outgoing');
  };

  const handleAddReferral = () => {
    setSecretariat((prev) => ({
      ...prev,
      letters: prev.letters.map((l) =>
        l.id === referModalLetter.id
          ? {
              ...l,
              status: 'ارجاع‌شده',
              referrals: [
                ...(l.referrals || []),
                {
                  id: 'ref-' + Date.now(),
                  fromUser: adminUser.name,
                  toUsers: [referTo],
                  type: referType,
                  note: referNote,
                  date: getNowJalaliDateTime(),
                  response: ''
                }
              ]
            }
          : l
      )
    }));
    setReferModalLetter(null);
    setReferNote('');
    showToast('نامه با موفقیت ارجاع داده شد.');
  };

  const activeLetters = secretariat.letters.filter((l) => !l.isDeleted);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-xs">
      {subSection === 'sec_dashboard' && (
        <>
          <h1 className="text-xl font-extrabold text-[#0f294a]">داشبورد دبیرخانه الکترونیکی</h1>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { label: 'نامه‌های وارده', val: secStats.incoming },
              { label: 'نامه‌های صادره', val: secStats.outgoing },
              { label: 'در انتظار اقدام', val: secStats.pending },
              { label: 'ارجاع‌شده', val: secStats.referred },
              { label: 'دارای مهلت پاسخ', val: secStats.withDeadline },
              { label: 'بایگانی‌شده', val: secStats.archived },
              { label: 'پیش‌نویس‌ها', val: secStats.drafts }
            ].map((c, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200">
                <span className="text-2xl font-extrabold text-[#0f294a] block mb-1">{toPersianDigits(c.val)}</span>
                <span className="text-slate-600">{c.label}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => onNavigate('sec_new')} className="px-4 py-2.5 rounded-xl bg-[#0f294a] text-white font-bold">
              ثبت نامه جدید (وارده / صادره)
            </button>
          </div>
        </>
      )}

      {subSection === 'sec_new' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <h2 className="text-base font-bold text-[#0f294a]">ثبت مکاتبه اداری جدید</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLetterDirection('incoming')}
                className={`px-3.5 py-1.5 rounded-xl font-bold ${letterDirection === 'incoming' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
              >
                نامه وارده
              </button>
              <button
                type="button"
                onClick={() => setLetterDirection('outgoing')}
                className={`px-3.5 py-1.5 rounded-xl font-bold ${letterDirection === 'outgoing' ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}
              >
                نامه صادره
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold mb-1">موضوع نامه *</label>
              <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            </div>
            <div>
              <label className="block font-bold mb-1">{letterDirection === 'incoming' ? 'سازمان فرستنده' : 'سازمان گیرنده'}</label>
              <input type="text" value={partyOrg} onChange={(e) => setPartyOrg(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            </div>
            <div>
              <label className="block font-bold mb-1">{letterDirection === 'incoming' ? 'نام فرستنده' : 'شخص دریافت‌کننده'}</label>
              <input type="text" value={partyPerson} onChange={(e) => setPartyPerson(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
            </div>
            {letterDirection === 'incoming' ? (
              <div>
                <label className="block font-bold mb-1">شماره نامه فرستنده</label>
                <input type="text" value={senderLetterNo} onChange={(e) => setSenderLetterNo(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
              </div>
            ) : (
              <>
                <div>
                  <label className="block font-bold mb-1">نام امضاکننده</label>
                  <input type="text" value={signerName} onChange={(e) => setSignerName(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
                </div>
                <div>
                  <label className="block font-bold mb-1">سمت امضاکننده</label>
                  <input type="text" value={signerTitle} onChange={(e) => setSignerTitle(e.target.value)} className="w-full px-3 py-2 rounded-xl border" />
                </div>
              </>
            )}
            <div className="md:col-span-3">
              <label className="block font-bold mb-1">متن / خلاصه نامه</label>
              <textarea rows={6} value={bodyText} onChange={(e) => setBodyText(e.target.value)} className="w-full p-3 rounded-xl border leading-6" />
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <button
              type="button"
              onClick={() =>
                exportLetterToDocx(
                  { subject, recipientOrg: partyOrg, recipientPerson: partyPerson, body: bodyText, signerName, signerTitle, copies },
                  secretariat.settings
                )
              }
              className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 font-bold"
            >
              پیش‌نمایش و دانلود Word (.docx)
            </button>
            <button type="button" onClick={() => registerLetter(true)} className="px-4 py-2 rounded-xl bg-slate-200 font-bold">
              ذخیره پیش‌نویس
            </button>
            <button type="button" onClick={() => registerLetter(false)} className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold">
              ثبت نهایی و صدور شماره اندیکاتور
            </button>
          </div>
        </div>
      )}

      {['sec_incoming', 'sec_outgoing', 'sec_mytasks', 'sec_drafts', 'sec_indicator', 'sec_archive'].includes(subSection) && (
        <div className="bg-white rounded-2xl border overflow-hidden">
          <div className="p-4 bg-slate-50 border-b font-bold text-sm text-[#0f294a]">
            فهرست مکاتبات و دفتر اندیکاتور دبیرخانه
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="py-3 px-4">شماره اندیکاتور</th>
                  <th className="py-3 px-4">نوع</th>
                  <th className="py-3 px-4">موضوع نامه</th>
                  <th className="py-3 px-4">فرستنده / گیرنده</th>
                  <th className="py-3 px-4">تاریخ</th>
                  <th className="py-3 px-4">وضعیت</th>
                  <th className="py-3 px-4">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {activeLetters
                  .filter((l) => {
                    if (subSection === 'sec_incoming') return l.direction === 'incoming' && !l.isDraft;
                    if (subSection === 'sec_outgoing') return l.direction === 'outgoing' && !l.isDraft;
                    if (subSection === 'sec_drafts') return l.isDraft;
                    return !l.isDraft;
                  })
                  .map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-blue-900">{toPersianDigits(l.indicatorNumber || 'پیش‌نویس')}</td>
                      <td className="py-3 px-4">{l.direction === 'incoming' ? 'وارده' : 'صادره'}</td>
                      <td className="py-3 px-4 font-bold">{l.subject}</td>
                      <td className="py-3 px-4">{l.senderOrg || l.recipientOrg}</td>
                      <td className="py-3 px-4">{toPersianDigits(l.letterDate)}</td>
                      <td className="py-3 px-4">{l.status}</td>
                      <td className="py-3 px-4 space-x-2 space-x-reverse">
                        <button onClick={() => setReferModalLetter(l)} className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold">
                          ارجاع
                        </button>
                        <button
                          onClick={() => {
                            exportLetterToDocx(l, secretariat.settings);
                            showToast('فایل Word نامه دانلود شد.');
                          }}
                          className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-bold"
                        >
                          Word
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {subSection === 'sec_templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {secretariat.templates.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-2xl p-5 border border-slate-200 space-y-2">
              <h4 className="font-bold text-sm text-[#0f294a]">{tpl.title}</h4>
              <p className="text-slate-600 leading-6">{tpl.body}</p>
              <button
                onClick={() => {
                  setSubject(tpl.subject);
                  setBodyText(tpl.body);
                  setLetterDirection('outgoing');
                  onNavigate('sec_new');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold"
              >
                استفاده از این قالب در نامه جدید
              </button>
            </div>
          ))}
        </div>
      )}

      {subSection === 'sec_settings' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
          <h3 className="font-bold text-base">تنظیمات الگوی شماره‌گذاری اندیکاتور</h3>
          <p>پیشوند نامه وارده: <b>{secretariat.settings.incomingPrefix}</b> | پیشوند نامه صادره: <b>{secretariat.settings.outgoingPrefix}</b></p>
        </div>
      )}

      {referModalLetter && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <h4 className="font-bold text-sm">ارجاع نامه: {referModalLetter.subject}</h4>
            <select value={referTo} onChange={(e) => setReferTo(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
              <option value="کارشناس ارزیابی">کارشناس ارزیابی</option>
              <option value="مدیر مجموعه / رئیس مرکز">مدیر مجموعه / رئیس مرکز</option>
              <option value="مسئول دبیرخانه">مسئول دبیرخانه</option>
            </select>
            <select value={referType} onChange={(e) => setReferType(e.target.value)} className="w-full px-3 py-2 rounded-xl border bg-white">
              {REFERRAL_TYPES.map((rt) => <option key={rt} value={rt}>{rt}</option>)}
            </select>
            <textarea rows={2} placeholder="هامش و دستور ارجاع..." value={referNote} onChange={(e) => setReferNote(e.target.value)} className="w-full p-2.5 rounded-xl border" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setReferModalLetter(null)} className="px-4 py-2 rounded-xl border">انصراف</button>
              <button onClick={handleAddReferral} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold">ثبت ارجاع</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
