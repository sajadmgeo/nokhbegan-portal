import React, { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';
import {
  Building2, Users, Award, Package, Layers, Search, Filter,
  ChevronLeft, ArrowRight, Shield, Lock, Unlock, Plus, Edit,
  Trash2, Upload, Download, CheckCircle, AlertCircle, X,
  BarChart3, Settings, LogOut, Eye, EyeOff, Globe, Phone,
  Mail, MapPin, Calendar, FileText, Briefcase, TrendingUp,
  Check, RefreshCw, Star, Database, FileSpreadsheet, Printer,
  History, UserCheck, Sparkles, SlidersHorizontal, Info
} from 'lucide-react';

// --- داده‌های اولیه آزمایشی (قابل حذف و جایگزینی) ---
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
    productCount: 3,
    products: [
      {
        name: 'بیناکنترل پلاس',
        brand: 'BinaControl',
        status: 'تجاری‌سازی شده',
        description: 'سامانه بینایی ماشین جهت تشخیص عیوب خطوط تولید خودروسازی و بسته‌بندی با دقت ۹۹.۴ درصد.',
        patent: 'ثبت اختراع شماره ۱۰۴۵۸۹'
      },
      {
        name: 'پلتفرم تحلیل متن فارسی نگار',
        brand: 'NegarNLP',
        status: 'فروش آزمایشی',
        description: 'موتور پردازش زبان طبیعی و خلاصه‌سازی اسناد سازمانی ویژه سازمان‌های دولتی و بانکی.',
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
    notes: 'شرکت منتخب جشنواره فناوری پردیس در سال ۱۴۰۲',
    shortDesc: 'توسعه‌دهنده سامانه‌های بینایی ماشین صنعتی و پردازش زبان طبیعی فارسی برای خطوط تولید هوشمند.',
    logoUrl: '',
    isPublic: true,
    isFeatured: true,
    publishInvestment: true,
    publishSales: false,
    locationStatus: 'مستقر در مرکز رشد',
    history: [
      { date: '1403/07/20', user: 'مدیر سامانه', action: 'تأیید انتشار عمومی شناسنامه شرکت' },
      { date: '1403/05/10', user: 'کارشناس ارزیابی', action: 'به‌روزرسانی آمار نیروی انسانی و فروش سال سوم' }
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
    productCount: 2,
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
    history: [
      { date: '1403/06/15', user: 'مدیر سامانه', action: 'افزودن به فهرست شرکت‌های منتخب' }
    ]
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
    productCount: 4,
    products: [
      {
        name: 'ربات حمل بار خودران سپهر AGV-500',
        brand: 'SepehrBot',
        status: 'تولید انبوه',
        description: 'ربات هوشمند جابجایی پالت در انبارهای لجستیک با ناوبری لیزری بدون نیاز به خط‌کشی.',
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
    nationalId: '',
    registrationNumber: '',
    companyType: 'هسته فناور',
    establishedDate: '1403/01/20',
    registeredCapital: '',
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
  },
  {
    id: 'comp-5',
    rowNumber: '5',
    status: 'خارج‌شده (موفق)',
    level: 'فارغ‌التحصیل مرکز رشد',
    name: 'الکترونیک دقیق تابان انرژی',
    slug: 'taban-energy-electronics',
    nationalId: '14005556677',
    registrationNumber: '489521',
    companyType: 'سهامی خاص',
    establishedDate: '1396/08/10',
    registeredCapital: '۱۵,۰۰۰,۰۰۰,۰۰۰ ریال',
    ceoName: 'دکتر سعید فرهادی',
    ceoPhone: '09126667788',
    ceoNationalId: '0054321876',
    ceoBirthDate: '1360/09/18',
    ceoDegree: 'دکتری مهندسی برق - قدرت',
    ceoUniversity: 'دانشگاه تهران',
    chairmanName: 'مهندس مهدی بهرامی',
    chairmanPhone: '09128889900',
    unitNumber: 'منتقل شده به فاز ۲ پارک',
    unitArea: '۲۵۰ مترمربع',
    postalCode: '1657145250',
    visitable: 'بله',
    workshopCode: '0214589333',
    economicCode: '411321654987',
    landline: '021-76251200',
    email: 'info@taban-power.ir',
    website: 'https://taban-power.ir',
    initialStaff: 4,
    thirdYearStaff: 21,
    totalStaff: 35,
    femaleStaff: 11,
    knowledgeBased: 'دانش‌بنیان تولیدی',
    recruitmentBase: 'فراخوان ۱۷ مرکز رشد',
    field: 'برق، الکترونیک و انرژی',
    techLicense: 'دارد',
    techLicenseTopic: 'اینورترهای خورشیدی متصل به شبکه و سامانه‌های مدیریت باتری',
    productCount: 3,
    products: [
      {
        name: 'اینورتر خورشیدی سه‌فاز ۵۰ کیلووات',
        brand: 'TabanGrid',
        status: 'تولید انبوه',
        description: 'اینورتر هوشمند با راندمان ۹۸.۶ درصد دارای سیستم مانیتورینگ ابری.',
        patent: 'ثبت اختراع شماره ۹۸۷۴۵'
      }
    ],
    entryDate: '1398/01/15',
    preIncubationEndDate: '1398/07/15',
    incubationEntryDate: '1398/08/01',
    threeYearEndDate: '1401/08/01',
    renewalDate: '1402/08/01',
    membershipStatus: 'خروج موفق به پارک فناوری',
    targetAudience: 'نیروگاه‌های خورشیدی، صنایع بزرگ و پیمانکاران EPC',
    investmentRaised: 'بله',
    investmentAmount: '۳۰ میلیارد تومان',
    revenueModel: 'فروش مستقیم تجهیزات و قراردادهای کلید در دست',
    salesYear1: '۴.۰ میلیارد تومان',
    salesYear2: '۱۴.۵ میلیارد تومان',
    salesYear3: '۳۲.۰ میلیارد تومان',
    salesYear4: '۵۸.۰ میلیارد تومان',
    exitDate: '1402/09/01',
    exitResult: 'استقرار مستقل در پارک فناوری پردیس',
    notes: 'یکی از شرکت‌های پیشرو در حوزه انرژی‌های تجدیدپذیر',
    shortDesc: 'طراحی و تولید اینورترهای خورشیدی متصل به شبکه، رکتیفایرهای صنعتی و سامانه‌های مدیریت ذخیره انرژی.',
    logoUrl: '',
    isPublic: true,
    isFeatured: false,
    publishInvestment: true,
    publishSales: false,
    locationStatus: 'مستقر در پارک فناوری',
    history: []
  }
];

// --- نگاشت فیلدهای پایگاه داده به عناوین ستون‌های فارسی اکسل ---
const DB_FIELD_DEFINITIONS = [
  { key: 'rowNumber', label: 'ردیف', group: 'هویتی و ثبتی', aliases: ['ردیف', 'شماره ردیف', 'row'] },
  { key: 'status', label: 'وضعیت', group: 'هویتی و ثبتی', aliases: ['وضعیت', 'وضعیت فعلی', 'status'] },
  { key: 'level', label: 'سطح‌بندی', group: 'هویتی و ثبتی', aliases: ['سطح‌بندی', 'سطح بندی', 'سطح', 'level'] },
  { key: 'name', label: 'نام شرکت / هسته فناور', group: 'هویتی و ثبتی', required: true, aliases: ['نام شرکت', 'نام شرکت/هسته فناور', 'نام شرکت / هسته فناور', 'نام هسته', 'نام', 'company'] },
  { key: 'nationalId', label: 'شناسه ملی', group: 'هویتی و ثبتی', aliases: ['شناسه ملی', 'شناسه ملی شرکت', 'کد ملی شرکت'] },
  { key: 'registrationNumber', label: 'شماره ثبت', group: 'هویتی و ثبتی', aliases: ['شماره ثبت', 'شماره ثبتی'] },
  { key: 'companyType', label: 'نوع شرکت', group: 'هویتی و ثبتی', aliases: ['نوع شرکت', 'شخصیت حقوقی', 'نوع'] },
  { key: 'establishedDate', label: 'تاریخ تأسیس', group: 'هویتی و ثبتی', aliases: ['تاریخ تأسیس', 'تاریخ تاسیس', 'سال تاسیس', 'سال تأسیس'] },
  { key: 'registeredCapital', label: 'سرمایه ثبتی', group: 'هویتی و ثبتی', aliases: ['سرمایه ثبتی', 'سرمایه'] },
  { key: 'shortDesc', label: 'معرفی کوتاه شرکت', group: 'هویتی و ثبتی', aliases: ['معرفی کوتاه', 'معرفی', 'شرح فعالیت', 'توضیح کوتاه'] },

  { key: 'ceoName', label: 'نام مدیرعامل', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['نام مدیرعامل', 'مدیرعامل', 'نام و نام خانوادگی مدیرعامل'] },
  { key: 'ceoPhone', label: 'شماره تماس مدیرعامل', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['شماره تماس', 'شماره تماس مدیرعامل', 'موبایل مدیرعامل', 'تلفن همراه مدیرعامل'] },
  { key: 'ceoNationalId', label: 'شماره ملی مدیرعامل', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['شماره ملی مدیرعامل', 'کد ملی مدیرعامل'] },
  { key: 'ceoBirthDate', label: 'تاریخ تولد مدیرعامل', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['تاریخ تولد', 'تاریخ تولد مدیرعامل'] },
  { key: 'ceoDegree', label: 'آخرین مدرک تحصیلی', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['آخرین مدرک تحصیلی', 'مدرک تحصیلی', 'تحصیلات'] },
  { key: 'ceoUniversity', label: 'دانشگاه محل تحصیل', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['دانشگاه محل تحصیل', 'دانشگاه'] },
  { key: 'chairmanName', label: 'نام رئیس هیئت‌مدیره', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['نام رئیس هیئت‌مدیره', 'رئیس هیئت مدیره', 'نام رئیس هیئت مدیره'] },
  { key: 'chairmanPhone', label: 'شماره تماس رئیس هیئت‌مدیره', group: 'مدیرعامل و هیئت‌مدیره', aliases: ['شماره تماس رئیس هیئت‌مدیره', 'تلفن رئیس هیئت مدیره', 'شماره تماس رئیس هیئت مدیره'] },

  { key: 'unitNumber', label: 'شماره واحد', group: 'استقرار و ارتباطی', aliases: ['شماره واحد', 'واحد', 'محل استقرار'] },
  { key: 'unitArea', label: 'متراژ واحد', group: 'استقرار و ارتباطی', aliases: ['متراژ واحد', 'متراژ', 'مساحت'] },
  { key: 'postalCode', label: 'کدپستی', group: 'استقرار و ارتباطی', aliases: ['کدپستی', 'کد پستی'] },
  { key: 'visitable', label: 'قابلیت بازدید', group: 'استقرار و ارتباطی', aliases: ['قابلیت بازدید', 'بازدید'] },
  { key: 'locationStatus', label: 'وضعیت استقرار', group: 'استقرار و ارتباطی', aliases: ['وضعیت استقرار', 'نوع استقرار'] },
  { key: 'workshopCode', label: 'کد کارگاهی', group: 'استقرار و ارتباطی', aliases: ['کد کارگاهی'] },
  { key: 'economicCode', label: 'کد اقتصادی', group: 'استقرار و ارتباطی', aliases: ['کد اقتصادی'] },
  { key: 'landline', label: 'شماره ثابت', group: 'استقرار و ارتباطی', aliases: ['شماره ثابت', 'تلفن ثابت', 'تلفن شرکت'] },
  { key: 'email', label: 'ایمیل رسمی شرکت', group: 'استقرار و ارتباطی', aliases: ['ایمیل رسمی شرکت', 'ایمیل', 'پست الکترونیک'] },
  { key: 'website', label: 'آدرس وبگاه', group: 'استقرار و ارتباطی', aliases: ['آدرس وبگاه', 'وبگاه', 'وبسایت', 'سایت'] },

  { key: 'initialStaff', label: 'نیروی انسانی ابتدای ورود', group: 'نیروی انسانی', aliases: ['نیروی انسانی ابتدای ورود', 'نیروی اولیه'] },
  { key: 'thirdYearStaff', label: 'نیروی انسانی انتهای سال سوم', group: 'نیروی انسانی', aliases: ['نیروی انسانی انتهای سال سوم', 'نیروی سال سوم'] },
  { key: 'totalStaff', label: 'تعداد کل نیروی انسانی سال', group: 'نیروی انسانی', aliases: ['تعداد کل نیروی انسانی سال', 'تعداد کل نیروی انسانی', 'نیروی انسانی', 'تعداد پرسنل'] },
  { key: 'femaleStaff', label: 'تعداد بانوان', group: 'نیروی انسانی', aliases: ['تعداد بانوان', 'نیروی انسانی بانوان', 'بانوان'] },

  { key: 'knowledgeBased', label: 'دانش‌بنیان', group: 'فناوری و محصولات', aliases: ['دانش‌بنیان', 'دانش بنیان', 'وضعیت دانش بنیان'] },
  { key: 'recruitmentBase', label: 'پایگاه جذب', group: 'فناوری و محصولات', aliases: ['پایگاه جذب', 'نحوه جذب'] },
  { key: 'field', label: 'حوزه فعالیت', group: 'فناوری و محصولات', aliases: ['حوزه فعالیت', 'حوزه فناوری', 'زمینه فعالیت'] },
  { key: 'techLicense', label: 'مجوز فناوری', group: 'فناوری و محصولات', aliases: ['مجوز فناوری', 'وضعیت مجوز فناوری'] },
  { key: 'techLicenseTopic', label: 'موضوع مجوز فناوری', group: 'فناوری و محصولات', aliases: ['موضوع مجوز یا عنوان پیشنهادی مجوز فناوری', 'موضوع مجوز فناوری', 'عنوان مجوز'] },
  { key: 'productCount', label: 'تعداد محصول', group: 'فناوری و محصولات', aliases: ['تعداد محصول', 'تعداد محصولات'] },
  { key: 'productNamesRaw', label: 'نام محصولات', group: 'فناوری و محصولات', aliases: ['نام محصولات', 'محصولات', 'نام محصول'] },
  { key: 'brandNamesRaw', label: 'نام برند', group: 'فناوری و محصولات', aliases: ['نام برند', 'برند'] },
  { key: 'patentRaw', label: 'ثبت اختراع', group: 'فناوری و محصولات', aliases: ['ثبت اختراع', 'اختراع'] },
  { key: 'productStatusRaw', label: 'آخرین وضعیت محصول', group: 'فناوری و محصولات', aliases: ['آخرین وضعیت محصول', 'وضعیت محصول'] },

  { key: 'entryDate', label: 'تاریخ ورود به مرکز رشد', group: 'عضویت در مرکز رشد', aliases: ['تاریخ ورود به مرکز رشد', 'تاریخ ورود'] },
  { key: 'preIncubationEndDate', label: 'تاریخ اتمام پیش‌رشد', group: 'عضویت در مرکز رشد', aliases: ['تاریخ اتمام پیش‌رشد', 'تاریخ پایان پیش رشد', 'تاریخ اتمام پیش رشد'] },
  { key: 'incubationEntryDate', label: 'تاریخ ورود به دوره رشد', group: 'عضویت در مرکز رشد', aliases: ['تاریخ ورود به دوره رشد', 'ورود به رشد'] },
  { key: 'membershipStatus', label: 'وضعیت شرکت در مرکز', group: 'عضویت در مرکز رشد', aliases: ['وضعیت شرکت', 'وضعیت عضویت'] },
  { key: 'threeYearEndDate', label: 'پایان سه سال عضویت', group: 'عضویت در مرکز رشد', aliases: ['پایان سه سال عضویت', 'تاریخ پایان سه سال عضویت', 'اتمام دوره رشد'] },
  { key: 'renewalDate', label: 'تمدید عضویت', group: 'عضویت در مرکز رشد', aliases: ['تمدید عضویت', 'تاریخ تمدید عضویت'] },

  { key: 'targetAudience', label: 'گروه مخاطب', group: 'کسب‌وکار و فروش', aliases: ['گروه مخاطب', 'مشتریان', 'گروه مخاطبان'] },
  { key: 'investmentRaised', label: 'جذب سرمایه', group: 'کسب‌وکار و فروش', aliases: ['جذب سرمایه', 'وضعیت جذب سرمایه'] },
  { key: 'investmentAmount', label: 'میزان سرمایه‌گذاری', group: 'کسب‌وکار و فروش', aliases: ['میزان سرمایه‌گذاری', 'میزان سرمایه گذاری', 'مبلغ سرمایه'] },
  { key: 'revenueModel', label: 'مدل درآمدی', group: 'کسب‌وکار و فروش', aliases: ['مدل درآمدی'] },
  { key: 'salesYear1', label: 'فروش سال اول', group: 'کسب‌وکار و فروش', aliases: ['فروش سال اول', 'فروش سال ۱'] },
  { key: 'salesYear2', label: 'فروش سال دوم', group: 'کسب‌وکار و فروش', aliases: ['فروش سال دوم', 'فروش سال ۲'] },
  { key: 'salesYear3', label: 'فروش سال سوم', group: 'کسب‌وکار و فروش', aliases: ['فروش سال سوم', 'فروش سال ۳'] },
  { key: 'salesYear4', label: 'فروش سال چهارم', group: 'کسب‌وکار و فروش', aliases: ['فروش سال چهارم', 'فروش سال ۴'] },

  { key: 'exitDate', label: 'تاریخ خروج', group: 'خروج و توضیحات', aliases: ['تاریخ خروج'] },
  { key: 'exitResult', label: 'نتیجه خروج', group: 'خروج و توضیحات', aliases: ['نتیجه خروج'] },
  { key: 'notes', label: 'توضیحات', group: 'خروج و توضیحات', aliases: ['توضیحات', 'توضیحات تکمیلی', 'ملاحظات'] }
];

const DEFAULT_ACCESS_POLICIES = {
  ceoPersonal: 'admin_only', // کد ملی، تاریخ تولد و موبایل مدیرعامل
  financialCodes: 'admin_only', // کد اقتصادی، کد کارگاهی، کدپستی
  salesData: 'conditional', // با تأیید مدیر عمومی می‌شود
  investmentData: 'conditional',
  staffDetails: 'public',
  membershipDates: 'public'
};

const toPersianDigits = (val) => {
  if (val === null || val === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (x) => persianDigits[x]);
};

const generateSlug = (name) => {
  return String(name || 'company')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FFa-zA-Z0-9-]/g, '')
    .toLowerCase() + '-' + Math.floor(100 + Math.random() * 900);
};

// --- کامپوننت لوگو / آواتار شرکت ---
const CompanyAvatar = ({ company, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 text-sm',
    md: 'w-14 h-14 text-lg',
    lg: 'w-24 h-24 text-2xl'
  };

  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt={company.name}
        className={`${sizeClasses[size]} rounded-xl object-contain bg-white border border-slate-200 p-1.5 shadow-sm shrink-0`}
      />
    );
  }

  const initials = (company.name || 'ش')
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

export default function App() {
  // --- وضعیت‌های اصلی برنامه ---
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

  // مسیریابی درون‌برنامه‌ای
  const [route, setRoute] = useState('public_home'); // public_home | company_detail | admin_login | admin_panel
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [adminUser, setAdminUser] = useState(null); // { username, role: 'admin' | 'expert', name }
  const [adminTab, setAdminTab] = useState('dashboard'); // dashboard | companies | form | excel | settings
  const [editingCompany, setEditingCompany] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_companies_v1', JSON.stringify(companies));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [companies]);

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_access_policies_v1', JSON.stringify(accessPolicies));
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [accessPolicies]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // --- آمار تجمیعی پویا ---
  const stats = useMemo(() => {
    const publicList = companies.filter((c) => c.isPublic);
    const activeCount = companies.filter((c) => c.status && c.status.includes('فعال')).length;
    const exitedCount = companies.filter((c) => c.status && c.status.includes('خارج')).length;
    const kbCount = companies.filter((c) => c.knowledgeBased && c.knowledgeBased.includes('دانش‌بنیان') && !c.knowledgeBased.includes('خیر')).length;
    const totalProducts = companies.reduce((sum, c) => sum + (Number(c.productCount) || (c.products?.length || 0)), 0);
    const totalStaff = companies.reduce((sum, c) => sum + (Number(c.totalStaff) || 0), 0);
    const fieldsSet = new Set(companies.map((c) => c.field).filter(Boolean));

    // توزیع بر اساس حوزه فناوری
    const byField = {};
    companies.forEach((c) => {
      const f = c.field || 'سایر حوزه‌ها';
      byField[f] = (byField[f] || 0) + 1;
    });

    // توزیع بر اساس سطح‌بندی
    const byLevel = {};
    companies.forEach((c) => {
      const l = c.level || 'تعیین نشده';
      byLevel[l] = (byLevel[l] || 0) + 1;
    });

    // شرکت‌های دارای عضویت رو به اتمام یا نیازمند بررسی
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
      byLevel,
      expiringCompanies
    };
  }, [companies]);

  const openCompanyDetail = (company) => {
    setSelectedCompanyId(company.id);
    setRoute('company_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-700 selection:text-white">
      {/* اعلان شناور (Toast) */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border bg-white border-slate-200 animate-bounce">
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span className="text-sm font-medium text-slate-800">{toast.message}</span>
        </div>
      )}

      {/* سربرگ سازمانی (Header) */}
      <header className="bg-[#0b1f3a] text-white border-b border-blue-900/60 sticky top-0 z-40 shadow-md no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div
            onClick={() => setRoute('public_home')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-lg shadow-blue-950/50 group-hover:scale-105 transition-transform">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-sky-300 bg-sky-950/80 border border-sky-700/40 px-2.5 py-0.5 rounded-full">
                  پارک فناوری پردیس
                </span>
                <span className="hidden sm:inline-block text-xs text-slate-300">
                  معاونت علمی، فناوری و اقتصاد دانش‌بنیان
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white mt-1">
                بانک اطلاعات و معرفی شرکت‌های مرکز رشد فناوری نخبگان
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {route !== 'public_home' && (
              <button
                onClick={() => setRoute('public_home')}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1.5"
              >
                <Globe className="w-4 h-4" />
                <span className="hidden md:inline">پرتال عمومی</span>
              </button>
            )}

            {adminUser ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setRoute('admin_panel')}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                    route === 'admin_panel'
                      ? 'bg-sky-500 text-slate-950 shadow-sm'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  <span>پنل مدیریت ({adminUser.name})</span>
                </button>
                <button
                  onClick={() => {
                    setAdminUser(null);
                    setRoute('public_home');
                    showToast('از پنل مدیریت خارج شدید.');
                  }}
                  title="خروج از حساب"
                  className="p-2 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setRoute('admin_login')}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-sky-300" />
                <span>ورود کارشناسان و مدیران</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* بدنه اصلی بر اساس مسیر فعال */}
      <main className="flex-1">
        {route === 'public_home' && (
          <PublicDirectoryView
            companies={companies}
            stats={stats}
            onSelectCompany={openCompanyDetail}
          />
        )}

        {route === 'company_detail' && (
          <CompanyProfileView
            company={companies.find((c) => c.id === selectedCompanyId)}
            accessPolicies={accessPolicies}
            isAdmin={!!adminUser}
            onBack={() => setRoute('public_home')}
            onEdit={(comp) => {
              setEditingCompany(comp);
              setAdminTab('form');
              setRoute('admin_panel');
            }}
          />
        )}

        {route === 'admin_login' && (
          <AdminLoginView
            onLogin={(user) => {
              setAdminUser(user);
              setRoute('admin_panel');
              showToast(`خوش آمدید، ${user.name}`);
            }}
            onCancel={() => setRoute('public_home')}
          />
        )}

        {route === 'admin_panel' && adminUser && (
          <AdminPanelView
            adminUser={adminUser}
            companies={companies}
            setCompanies={setCompanies}
            stats={stats}
            activeTab={adminTab}
            setActiveTab={setAdminTab}
            editingCompany={editingCompany}
            setEditingCompany={setEditingCompany}
            accessPolicies={accessPolicies}
            setAccessPolicies={setAccessPolicies}
            onViewPublicProfile={openCompanyDetail}
            showToast={showToast}
          />
        )}
      </main>

      {/* پابرگ سازمانی (Footer) */}
      <footer className="bg-[#081629] text-slate-400 border-t border-slate-800 mt-16 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2.5 text-white font-bold text-base mb-2">
                <Building2 className="w-5 h-5 text-sky-400" />
                <span>مرکز رشد فناوری نخبگان</span>
              </div>
              <p className="text-xs leading-6 text-slate-400">
                وابسته به پارک فناوری پردیس — بستری تخصصی برای پذیرش، توانمندسازی، تجاری‌سازی دستاوردهای فناورانه و حمایت از هسته‌ها و شرکت‌های دانش‌بنیان.
              </p>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                <span>کیلومتر ۲۰ جاده دماوند، پارک فناوری پردیس، مرکز رشد فناوری نخبگان</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <span>تلفن دبیرخانه: ۰۲۱-۷۶۲۵۰۲۵۰</span>
              </div>
            </div>
            <div className="md:text-left text-xs space-y-1">
              <p className="text-slate-300 font-medium">سامانه جامع بانک اطلاعات و شناسنامه شرکت‌ها</p>
              <p>تمامی حقوق مادی و معنوی متعلق به پارک فناوری پردیس است.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// ۱. نمای وب‌سایت عمومی معرفی شرکت‌ها (Public Directory)
// ============================================================================
function PublicDirectoryView({ companies, stats, onSelectCompany }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('همه');
  const [selectedLevel, setSelectedLevel] = useState('همه');
  const [selectedStatus, setSelectedStatus] = useState('همه');
  const [selectedKB, setSelectedKB] = useState('همه');
  const [selectedType, setSelectedType] = useState('همه');
  const [selectedLocation, setSelectedLocation] = useState('همه');
  const [sortBy, setSortBy] = useState('newest'); // newest | name | staff | products
  const [showFilters, setShowFilters] = useState(false);

  const publicCompanies = useMemo(() => companies.filter((c) => c.isPublic), [companies]);

  const filterOptions = useMemo(() => {
    return {
      fields: ['همه', ...new Set(publicCompanies.map((c) => c.field).filter(Boolean))],
      levels: ['همه', ...new Set(publicCompanies.map((c) => c.level).filter(Boolean))],
      statuses: ['همه', ...new Set(publicCompanies.map((c) => c.status).filter(Boolean))],
      kbs: ['همه', 'دانش‌بنیان', 'غیر دانش‌بنیان'],
      types: ['همه', ...new Set(publicCompanies.map((c) => c.companyType).filter(Boolean))],
      locations: ['همه', ...new Set(publicCompanies.map((c) => c.locationStatus).filter(Boolean))]
    };
  }, [publicCompanies]);

  const featuredCompanies = useMemo(
    () => publicCompanies.filter((c) => c.isFeatured),
    [publicCompanies]
  );

  const filteredCompanies = useMemo(() => {
    return publicCompanies
      .filter((c) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !q ||
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.field && c.field.toLowerCase().includes(q)) ||
          (c.shortDesc && c.shortDesc.toLowerCase().includes(q)) ||
          (c.products && c.products.some((p) => p.name && p.name.toLowerCase().includes(q)));

        const matchesField = selectedField === 'همه' || c.field === selectedField;
        const matchesLevel = selectedLevel === 'همه' || c.level === selectedLevel;
        const matchesStatus = selectedStatus === 'همه' || c.status === selectedStatus;
        const matchesType = selectedType === 'همه' || c.companyType === selectedType;
        const matchesLocation = selectedLocation === 'همه' || c.locationStatus === selectedLocation;

        const isKB = c.knowledgeBased && c.knowledgeBased.includes('دانش‌بنیان') && !c.knowledgeBased.includes('خیر');
        const matchesKB =
          selectedKB === 'همه' ||
          (selectedKB === 'دانش‌بنیان' && isKB) ||
          (selectedKB === 'غیر دانش‌بنیان' && !isKB);

        return (
          matchesSearch &&
          matchesField &&
          matchesLevel &&
          matchesStatus &&
          matchesKB &&
          matchesType &&
          matchesLocation
        );
      })
      .sort((a, b) => {
        if (sortBy === 'name') return (a.name || '').localeCompare(b.name || '', 'fa');
        if (sortBy === 'staff') return (Number(b.totalStaff) || 0) - (Number(a.totalStaff) || 0);
        if (sortBy === 'products') return (Number(b.productCount) || 0) - (Number(a.productCount) || 0);
        return 0;
      });
  }, [
    publicCompanies,
    searchQuery,
    selectedField,
    selectedLevel,
    selectedStatus,
    selectedKB,
    selectedType,
    selectedLocation,
    sortBy
  ]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedField('همه');
    setSelectedLevel('همه');
    setSelectedStatus('همه');
    setSelectedKB('همه');
    setSelectedType('همه');
    setSelectedLocation('همه');
  };

  return (
    <div>
      {/* بخش اول: بنر معرفی مرکز رشد */}
      <section className="bg-gradient-to-bl from-[#0b1f3a] via-[#102c54] to-[#1e40af] text-white py-14 sm:py-20 border-b border-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sky-200 text-xs font-medium mb-5">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>اکوسیستم نوآوری و فناوری پارک فناوری پردیس</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-4">
              شرکت‌های عضو مرکز رشد فناوری نخبگان
            </h2>
            <p className="text-slate-200 text-sm sm:text-lg leading-relaxed font-normal">
              معرفی توانمندی‌ها، محصولات و دستاوردهای شرکت‌ها و هسته‌های فناور عضو مرکز رشد فناوری نخبگان پارک فناوری پردیس
            </p>
          </div>
        </div>
      </section>

      {/* بخش دوم: آمار تجمیعی خودکار */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
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
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200/90 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {toPersianDigits(item.value)}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* بخش چهارم: شرکت‌های منتخب */}
      {featuredCompanies.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">شرکت‌های منتخب مرکز رشد</h3>
                <p className="text-xs text-slate-500">واحدهای فناور برگزیده بر اساس ارزیابی‌های دوره‌ای</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {featuredCompanies.slice(0, 3).map((company) => (
              <div
                key={company.id}
                onClick={() => onSelectCompany(company)}
                className="bg-gradient-to-b from-white to-blue-50/40 rounded-2xl p-5 border border-blue-200/80 shadow-sm hover:shadow-lg hover:border-blue-400 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <CompanyAvatar company={company} size="md" />
                      <div>
                        <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md mb-1">
                          {company.field}
                        </span>
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-1">
                          {company.name}
                        </h4>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-6 line-clamp-2 mb-4">
                    {company.shortDesc || 'توسعه‌دهنده محصولات و خدمات فناورانه در پارک فناوری پردیس'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200/70 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">{company.level}</span>
                  <span className="text-blue-700 font-semibold flex items-center gap-1 group-hover:translate-x-[-2px] transition-transform">
                    مشاهده شناسنامه
                    <ChevronLeft className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* بخش سوم: جست‌وجو، فیلتر و فهرست جامع شرکت‌ها */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            {/* کادر جستجو */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو بر اساس نام شرکت، محصول یا حوزه فناوری..."
                className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                  showFilters
                    ? 'bg-blue-50 border-blue-300 text-blue-800'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>فیلترهای پیشرفته</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm text-slate-700 bg-white outline-none focus:border-blue-600"
              >
                <option value="newest">مرتب‌سازی: پیش‌فرض</option>
                <option value="name">بر اساس حروف الفبا</option>
                <option value="staff">بیشترین نیروی انسانی</option>
                <option value="products">بیشترین تعداد محصول</option>
              </select>
            </div>
          </div>

          {/* پنل فیلترهای ۶ گانه */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">حوزه فعالیت</label>
                <select
                  value={selectedField}
                  onChange={(e) => setSelectedField(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.fields.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">سطح‌بندی شرکت</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.levels.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">وضعیت عضویت</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.statuses.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">دانش‌بنیان بودن</label>
                <select
                  value={selectedKB}
                  onChange={(e) => setSelectedKB(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.kbs.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">نوع شرکت</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.types.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">وضعیت استقرار</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                >
                  {filterOptions.locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  پاک کردن همه فیلترها
                </button>
              </div>
            </div>
          )}
        </div>

        {/* هدر نتایج */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            فهرست شرکت‌ها و هسته‌های فناور ({toPersianDigits(filteredCompanies.length)} واحد)
          </h3>
        </div>

        {/* کارت‌های شرکت‌ها */}
        {filteredCompanies.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700 mb-1">شرکتی با این مشخصات یافت نشد</h4>
            <p className="text-sm text-slate-500 mb-4">عبارت جست‌وجو یا فیلترهای انتخاب‌شده را تغییر دهید.</p>
            <button
              onClick={resetFilters}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
            >
              نمایش همه شرکت‌ها
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => {
              const isKB = company.knowledgeBased && company.knowledgeBased.includes('دانش‌بنیان') && !company.knowledgeBased.includes('خیر');
              return (
                <div
                  key={company.id}
                  className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-3.5 mb-4">
                      <CompanyAvatar company={company} size="md" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              company.status?.includes('فعال')
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-slate-100 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {company.status || 'فعال'}
                          </span>
                          {isKB && (
                            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              دانش‌بنیان
                            </span>
                          )}
                        </div>
                        <h4
                          onClick={() => onSelectCompany(company)}
                          className="font-bold text-slate-900 text-base group-hover:text-blue-700 transition-colors cursor-pointer truncate"
                        >
                          {company.name}
                        </h4>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{company.field}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-6 line-clamp-3 mb-4 min-h-[4.5rem]">
                      {company.shortDesc || 'واحد فناور عضو مرکز رشد فناوری نخبگان پارک فناوری پردیس'}
                    </p>

                    <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                      <div className="bg-slate-50 rounded-lg p-2">
                        <span className="text-slate-400 block text-[11px]">سطح‌بندی</span>
                        <span className="font-semibold text-slate-700 truncate block">
                          {company.level || 'تعیین نشده'}
                        </span>
                      </div>
                      <div className="bg-slate-50 rounded-lg p-2">
                        <span className="text-slate-400 block text-[11px]">تعداد محصولات</span>
                        <span className="font-semibold text-slate-700">
                          {toPersianDigits(company.productCount || company.products?.length || 0)} محصول
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400 font-mono" dir="ltr">
                      /companies/{company.slug}
                    </span>
                    <button
                      onClick={() => onSelectCompany(company)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#0f294a] hover:bg-blue-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <span>مشاهده شناسنامه شرکت</span>
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

// ============================================================================
// ۲. صفحه اختصاصی معرفی و شناسنامه شرکت (Company Profile)
// ============================================================================
function CompanyProfileView({ company, accessPolicies, isAdmin, onBack, onEdit }) {
  if (!company) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-4">شرکت موردنظر یافت نشد.</p>
        <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
          بازگشت به فهرست شرکت‌ها
        </button>
      </div>
    );
  }

  const canShowInvestment =
    isAdmin || (accessPolicies.investmentData !== 'admin_only' && company.publishInvestment);
  const canShowSales =
    isAdmin || (accessPolicies.salesData !== 'admin_only' && company.publishSales);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* نوار ابزار بالای شناسنامه */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست شرکت‌ها</span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden sm:inline-block text-xs text-slate-500 bg-slate-200/70 px-3 py-1.5 rounded-lg font-mono" dir="ltr">
            /companies/{company.slug}
          </span>
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
            className="px-4 py-2 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-sm font-semibold flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>دریافت PDF / چاپ شناسنامه</span>
          </button>
        </div>
      </div>

      {/* هدر شناسنامه رسمی (مخصوص چاپ نیز بهینه شده) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="bg-gradient-to-l from-[#0b1f3a] to-[#1e3a8a] text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <CompanyAvatar company={company} size="lg" />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  {company.status}
                </span>
                {company.level && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-200 border border-sky-400/30">
                    {company.level}
                  </span>
                )}
                {company.knowledgeBased && !company.knowledgeBased.includes('خیر') && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-200 border border-amber-400/30">
                    {company.knowledgeBased}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">{company.name}</h1>
              <p className="text-sky-200 text-sm font-medium">{company.field}</p>
            </div>
          </div>
        </div>

        {/* الف) معرفی عمومی */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0f294a] mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            معرفی عمومی و اطلاعات ارتباطی
          </h2>
          <p className="text-sm text-slate-700 leading-7 mb-6">
            {company.shortDesc || 'توضیحاتی برای این شرکت ثبت نشده است.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block mb-1">نوع شخصیت حقوقی</span>
              <span className="font-bold text-slate-800">{company.companyType || '—'}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block mb-1">تاریخ تأسیس</span>
              <span className="font-bold text-slate-800">{toPersianDigits(company.establishedDate) || '—'}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block mb-1">تلفن تماس رسمی</span>
              <span className="font-bold text-slate-800" dir="ltr">{toPersianDigits(company.landline) || '—'}</span>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block mb-1">ایمیل رسمی</span>
              <span className="font-bold text-slate-800 text-xs">{company.email || '—'}</span>
            </div>
          </div>

          {company.website && (
            <div className="mt-4 flex items-center gap-2 text-sm">
              <Globe className="w-4 h-4 text-blue-600" />
              <span className="text-slate-600">وبگاه رسمی:</span>
              <a
                href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                target="_blank"
                rel="noreferrer"
                className="text-blue-700 font-semibold hover:underline"
                dir="ltr"
              >
                {company.website}
              </a>
            </div>
          )}
        </div>

        {/* ب) معرفی محصولات و خدمات */}
        <div className="p-6 sm:p-8 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#0f294a] flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              محصولات، خدمات و دستاوردهای فناورانه
            </h2>
            <span className="text-xs font-semibold bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
              تعداد کل محصولات: {toPersianDigits(company.productCount || company.products?.length || 0)}
            </span>
          </div>

          {company.techLicenseTopic && (
            <div className="mb-5 p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-sm">
              <span className="font-bold text-blue-900">موضوع مجوز فناوری: </span>
              <span className="text-slate-800">{company.techLicenseTopic}</span>
            </div>
          )}

          {company.products && company.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {company.products.map((prod, index) => (
                <div key={index} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{prod.name}</h3>
                      {prod.brand && (
                        <span className="text-xs text-blue-700 font-medium">برند: {prod.brand}</span>
                      )}
                    </div>
                    {prod.status && (
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-medium">
                        {prod.status}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-6 mb-2">{prod.description}</p>
                  {prod.patent && prod.patent !== 'ندارد' && (
                    <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg inline-block">
                      ثبت اختراع: {toPersianDigits(prod.patent)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">جزئیات محصولات ثبت نشده است.</p>
          )}
        </div>

        {/* ج و د) اطلاعات کسب‌وکار و نیروی انسانی */}
        <div className="p-6 sm:p-8 border-b border-slate-200 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* اطلاعات کسب‌وکار */}
          <div>
            <h2 className="text-base font-bold text-[#0f294a] mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-blue-600" />
              اطلاعات کسب‌وکار و بازار
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">مدل درآمدی:</span>
                <span className="font-semibold text-slate-800 text-left">{company.revenueModel || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">گروه مخاطبان و مشتریان:</span>
                <span className="font-semibold text-slate-800 text-left">{company.targetAudience || '—'}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">وضعیت جذب سرمایه:</span>
                <span className="font-semibold text-slate-800">{company.investmentRaised || '—'}</span>
              </div>
              {canShowInvestment && company.investmentAmount && (
                <div className="flex justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">میزان سرمایه‌گذاری جذب‌شده:</span>
                  <span className="font-bold text-emerald-700">{toPersianDigits(company.investmentAmount)}</span>
                </div>
              )}
              {canShowSales && (company.salesYear1 || company.salesYear2 || company.salesYear3) && (
                <div className="mt-3 p-3 rounded-xl bg-emerald-50/70 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-900 block mb-2">آمار فروش (تأیید شده برای انتشار):</span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {company.salesYear1 && <div>سال اول: <b>{toPersianDigits(company.salesYear1)}</b></div>}
                    {company.salesYear2 && <div>سال دوم: <b>{toPersianDigits(company.salesYear2)}</b></div>}
                    {company.salesYear3 && <div>سال سوم: <b>{toPersianDigits(company.salesYear3)}</b></div>}
                    {company.salesYear4 && <div>سال چهارم: <b>{toPersianDigits(company.salesYear4)}</b></div>}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* اطلاعات نیروی انسانی */}
          <div>
            <h2 className="text-base font-bold text-[#0f294a] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              سرمایه انسانی
            </h2>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-3.5 text-center">
                <span className="text-2xl font-extrabold text-blue-900 block">
                  {toPersianDigits(company.totalStaff || 0)}
                </span>
                <span className="text-xs text-slate-600 mt-1 block">کل نیروی انسانی</span>
              </div>
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3.5 text-center">
                <span className="text-2xl font-extrabold text-purple-900 block">
                  {toPersianDigits(company.femaleStaff || 0)}
                </span>
                <span className="text-xs text-slate-600 mt-1 block">تعداد بانوان</span>
              </div>
              <div className="bg-slate-100 border border-slate-200 rounded-xl p-3.5 text-center">
                <span className="text-2xl font-extrabold text-slate-800 block">
                  {toPersianDigits(company.initialStaff || 0)}
                </span>
                <span className="text-xs text-slate-600 mt-1 block">ابتدای ورود</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>مطابق سیاست‌های حفاظت از داده‌های مرکز رشد، اطلاعات هویتی و تماس شخصی مدیرعامل و اعضای هیئت‌مدیره محرمانه است.</span>
            </div>
          </div>
        </div>

        {/* هـ) سوابق عضویت در مرکز رشد */}
        <div className="p-6 sm:p-8 bg-slate-50/60">
          <h2 className="text-base font-bold text-[#0f294a] mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            سوابق عضویت در مرکز رشد فناوری نخبگان
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            {[
              { label: 'ورود به مرکز رشد', val: company.entryDate },
              { label: 'پایان پیش‌رشد', val: company.preIncubationEndDate },
              { label: 'ورود به دوره رشد', val: company.incubationEntryDate },
              { label: 'پایان ۳ سال عضویت', val: company.threeYearEndDate },
              { label: 'تمدید عضویت', val: company.renewalDate },
              { label: 'وضعیت فعلی', val: company.membershipStatus || company.status }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-400 block mb-1">{item.label}</span>
                <span className="font-bold text-slate-800">{toPersianDigits(item.val) || '—'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ۳. صفحه ورود به پنل مدیریت (Admin Login)
// ============================================================================
function AdminLoginView({ onLogin, onCancel }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === '1234') {
      onLogin({ username: 'admin', role: 'admin', name: 'مدیر کل مرکز رشد' });
    } else if (username === 'expert' && password === '1234') {
      onLogin({ username: 'expert', role: 'expert', name: 'کارشناس ارزیابی' });
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-7">
        <div className="w-12 h-12 rounded-2xl bg-[#0f294a] text-white flex items-center justify-center mx-auto mb-4">
          <Shield className="w-6 h-6 text-sky-300" />
        </div>
        <h2 className="text-xl font-bold text-center text-slate-900 mb-1">ورود به پنل مدیریت سامانه</h2>
        <p className="text-xs text-center text-slate-500 mb-6">
          مرکز رشد فناوری نخبگان — پارک فناوری پردیس
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              dir="ltr"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:border-blue-600 outline-none"
              required
            />
          </div>

          <div className="p-3 rounded-xl bg-blue-50 border border-blue-200/80 text-xs text-blue-900 space-y-1">
            <p className="font-bold">حساب‌های آزمایشی آماده ورود:</p>
            <p>• مدیر کل: <code className="font-mono bg-white px-1.5 py-0.5 rounded">admin</code> / رمز: <code className="font-mono bg-white px-1.5 py-0.5 rounded">1234</code></p>
            <p>• کارشناس مجاز: <code className="font-mono bg-white px-1.5 py-0.5 rounded">expert</code> / رمز: <code className="font-mono bg-white px-1.5 py-0.5 rounded">1234</code></p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-sm font-semibold transition-colors"
            >
              ورود به سامانه
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm font-medium"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// ۴. پنل مدیریت و ورود اطلاعات (Admin Panel)
// ============================================================================
function AdminPanelView({
  adminUser,
  companies,
  setCompanies,
  stats,
  activeTab,
  setActiveTab,
  editingCompany,
  setEditingCompany,
  accessPolicies,
  setAccessPolicies,
  onViewPublicProfile,
  showToast
}) {
  const isSuperAdmin = adminUser.role === 'admin';

  // خروجی اکسل از کل اطلاعات
  const handleExportExcel = () => {
    const rows = companies.map((c, idx) => ({
      'ردیف': c.rowNumber || idx + 1,
      'وضعیت': c.status || '',
      'سطح‌بندی': c.level || '',
      'نام شرکت/هسته فناور': c.name || '',
      'شناسه ملی': c.nationalId || '',
      'شماره ثبت': c.registrationNumber || '',
      'نوع شرکت': c.companyType || '',
      'تاریخ تأسیس': c.establishedDate || '',
      'سرمایه ثبتی': c.registeredCapital || '',
      'نام مدیرعامل': c.ceoName || '',
      'شماره تماس': c.ceoPhone || '',
      'شماره ملی مدیرعامل': c.ceoNationalId || '',
      'تاریخ تولد': c.ceoBirthDate || '',
      'آخرین مدرک تحصیلی': c.ceoDegree || '',
      'دانشگاه محل تحصیل': c.ceoUniversity || '',
      'نام رئیس هیئت‌مدیره': c.chairmanName || '',
      'شماره تماس رئیس هیئت‌مدیره': c.chairmanPhone || '',
      'شماره واحد': c.unitNumber || '',
      'متراژ واحد': c.unitArea || '',
      'کدپستی': c.postalCode || '',
      'قابلیت بازدید': c.visitable || '',
      'کد کارگاهی': c.workshopCode || '',
      'کد اقتصادی': c.economicCode || '',
      'شماره ثابت': c.landline || '',
      'ایمیل رسمی شرکت': c.email || '',
      'آدرس وبگاه': c.website || '',
      'نیروی انسانی ابتدای ورود': c.initialStaff || 0,
      'نیروی انسانی انتهای سال سوم': c.thirdYearStaff || 0,
      'تعداد کل نیروی انسانی سال': c.totalStaff || 0,
      'تعداد بانوان': c.femaleStaff || 0,
      'دانش‌بنیان': c.knowledgeBased || '',
      'پایگاه جذب': c.recruitmentBase || '',
      'حوزه فعالیت': c.field || '',
      'مجوز فناوری': c.techLicense || '',
      'موضوع مجوز یا عنوان پیشنهادی مجوز فناوری': c.techLicenseTopic || '',
      'تعداد محصول': c.productCount || 0,
      'نام محصولات': (c.products || []).map((p) => p.name).join('، '),
      'نام برند': (c.products || []).map((p) => p.brand).filter(Boolean).join('، '),
      'ثبت اختراع': (c.products || []).map((p) => p.patent).filter(Boolean).join('، '),
      'آخرین وضعیت محصول': (c.products || []).map((p) => p.status).filter(Boolean).join('، '),
      'تاریخ ورود به مرکز رشد': c.entryDate || '',
      'تاریخ اتمام پیش‌رشد': c.preIncubationEndDate || '',
      'تاریخ ورود به دوره رشد': c.incubationEntryDate || '',
      'وضعیت شرکت': c.membershipStatus || '',
      'پایان سه سال عضویت': c.threeYearEndDate || '',
      'تمدید عضویت': c.renewalDate || '',
      'گروه مخاطب': c.targetAudience || '',
      'جذب سرمایه': c.investmentRaised || '',
      'میزان سرمایه‌گذاری': c.investmentAmount || '',
      'مدل درآمدی': c.revenueModel || '',
      'فروش سال اول': c.salesYear1 || '',
      'فروش سال دوم': c.salesYear2 || '',
      'فروش سال سوم': c.salesYear3 || '',
      'فروش سال چهارم': c.salesYear4 || '',
      'تاریخ خروج': c.exitDate || '',
      'نتیجه خروج': c.exitResult || '',
      'توضیحات': c.notes || ''
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'شرکت‌های مرکز رشد');
    XLSX.writeFile(wb, 'Nokhbegan_Companies_Database.xlsx');
    showToast('فایل اکسل اطلاعات شرکت‌ها با موفقیت دانلود شد.');
  };

  // پشتیبان‌گیری JSON
  const handleBackupJson = () => {
    const blob = new Blob([JSON.stringify(companies, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nokhbegan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('فایل پشتیبان پایگاه داده ذخیره شد.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* نوار تب‌های پنل مدیریت */}
      <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-200 mb-6 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'dashboard', label: 'داشبورد و آمار', icon: BarChart3 },
            { id: 'companies', label: `مدیریت شرکت‌ها (${toPersianDigits(companies.length)})`, icon: Building2 },
            {
              id: 'form',
              label: editingCompany ? 'ویرایش شرکت' : 'ثبت دستی شرکت جدید',
              icon: Plus
            },
            { id: 'excel', label: 'بارگذاری گروهی اکسل', icon: FileSpreadsheet },
            { id: 'settings', label: 'سطوح دسترسی و پشتیبان', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                if (tab.id === 'form' && activeTab !== 'form') {
                  setEditingCompany(null);
                }
                setActiveTab(tab.id);
              }}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-[#0f294a] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 px-2">
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>خروجی اکسل</span>
          </button>
        </div>
      </div>

      {/* محتوای تب فعال */}
      {activeTab === 'dashboard' && (
        <AdminDashboardTab
          stats={stats}
          companies={companies}
          onNavigateTab={setActiveTab}
          onEditCompany={(c) => {
            setEditingCompany(c);
            setActiveTab('form');
          }}
        />
      )}

      {activeTab === 'companies' && (
        <AdminCompaniesListTab
          companies={companies}
          setCompanies={setCompanies}
          isSuperAdmin={isSuperAdmin}
          adminUser={adminUser}
          onEdit={(c) => {
            setEditingCompany(c);
            setActiveTab('form');
          }}
          onViewPublic={onViewPublicProfile}
          showToast={showToast}
        />
      )}

      {activeTab === 'form' && (
        <AdminCompanyFormTab
          editingCompany={editingCompany}
          companies={companies}
          setCompanies={setCompanies}
          adminUser={adminUser}
          onDone={() => {
            setEditingCompany(null);
            setActiveTab('companies');
          }}
          showToast={showToast}
        />
      )}

      {activeTab === 'excel' && (
        <AdminExcelImportTab
          companies={companies}
          setCompanies={setCompanies}
          adminUser={adminUser}
          onDone={() => setActiveTab('companies')}
          showToast={showToast}
        />
      )}

      {activeTab === 'settings' && (
        <AdminSettingsTab
          companies={companies}
          setCompanies={setCompanies}
          accessPolicies={accessPolicies}
          setAccessPolicies={setAccessPolicies}
          isSuperAdmin={isSuperAdmin}
          onBackupJson={handleBackupJson}
          onExportExcel={handleExportExcel}
          showToast={showToast}
        />
      )}
    </div>
  );
}

// --- الف) داشبورد پنل مدیریت ---
function AdminDashboardTab({ stats, companies, onNavigateTab, onEditCompany }) {
  const maxFieldCount = Math.max(...Object.values(stats.byField), 1);

  return (
    <div className="space-y-6">
      {/* کارت‌های کلیدی */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: 'کل شرکت‌ها و هسته‌ها', val: stats.total, color: 'border-blue-500 text-blue-700' },
          { label: 'شرکت‌های فعال', val: stats.activeCount, color: 'border-emerald-500 text-emerald-700' },
          { label: 'شرکت‌های خارج‌شده', val: stats.exitedCount, color: 'border-slate-500 text-slate-700' },
          { label: 'شرکت‌های دانش‌بنیان', val: stats.kbCount, color: 'border-indigo-500 text-indigo-700' },
          { label: 'مجموع محصولات ثبت‌شده', val: stats.totalProducts, color: 'border-amber-500 text-amber-700' }
        ].map((card, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 border-r-4 ${card.color} shadow-sm border border-slate-200`}>
            <span className="text-xs text-slate-500 block mb-2">{card.label}</span>
            <span className="text-3xl font-extrabold text-slate-900">{toPersianDigits(card.val)}</span>
          </div>
        ))}
      </div>

      {/* نمودار توزیع حوزه‌ها و هشدار پایان عضویت */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* نمودار میله‌ای افقی حوزه‌های فناوری */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            تعداد شرکت‌ها بر اساس حوزه فعالیت
          </h3>
          <div className="space-y-3.5">
            {Object.entries(stats.byField).map(([field, count]) => (
              <div key={field}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span className="text-slate-700">{field}</span>
                  <span className="font-bold text-blue-800">{toPersianDigits(count)} شرکت</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-l from-blue-600 to-sky-400 rounded-full"
                    style={{ width: `${(count / maxFieldCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* شرکت‌های دارای عضویت رو به اتمام */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              شرکت‌های دارای عضویت رو به اتمام یا آماده خروج
            </h3>
            {stats.expiringCompanies.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">موردی برای نمایش وجود ندارد.</p>
            ) : (
              <div className="space-y-3">
                {stats.expiringCompanies.map((c) => (
                  <div
                    key={c.id}
                    className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3"
                  >
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        پایان ۳ سال: <b>{toPersianDigits(c.threeYearEndDate || 'ثبت نشده')}</b> | وضعیت: {c.membershipStatus}
                      </p>
                    </div>
                    <button
                      onClick={() => onEditCompany(c)}
                      className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-900 text-xs font-semibold hover:bg-amber-100 shrink-0"
                    >
                      بررسی وضعیت
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('excel')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              بارگذاری فایل اکسل شرکت‌ها
            </button>
            <button
              onClick={() => onNavigateTab('form')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              ثبت دستی شرکت جدید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- ب) مدیریت لیست شرکت‌ها و کنترل انتشار ---
function AdminCompaniesListTab({
  companies,
  setCompanies,
  isSuperAdmin,
  adminUser,
  onEdit,
  onViewPublic,
  showToast
}) {
  const [search, setSearch] = useState('');
  const [historyModalCompany, setHistoryModalCompany] = useState(null);

  const filtered = companies.filter(
    (c) =>
      !search ||
      (c.name && c.name.includes(search)) ||
      (c.nationalId && c.nationalId.includes(search)) ||
      (c.field && c.field.includes(search))
  );

  const togglePublish = (id) => {
    setCompanies((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const nextState = !c.isPublic;
        return {
          ...c,
          isPublic: nextState,
          history: [
            {
              date: new Date().toLocaleDateString('fa-IR'),
              user: adminUser.name,
              action: nextState ? 'انتشار عمومی شناسنامه شرکت' : 'لغو انتشار عمومی (مخفی‌سازی)'
            },
            ...(c.history || [])
          ]
        };
      })
    );
    showToast('وضعیت انتشار عمومی شرکت به‌روزرسانی شد.');
  };

  const toggleFeatured = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c))
    );
    showToast('وضعیت نمایش در بخش شرکت‌های منتخب تغییر کرد.');
  };

  const handleDelete = (company) => {
    if (!isSuperAdmin) {
      showToast('فقط مدیر کل سامانه مجوز حذف شرکت را دارد.', 'error');
      return;
    }
    if (window.confirm(`آیا از حذف کامل «${company.name}» اطمینان دارید؟ این عمل قابل بازگشت نیست.`)) {
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      showToast('شرکت موردنظر با موفقیت حذف شد.');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو بر اساس نام شرکت، شناسه ملی یا حوزه..."
            className="w-full pr-10 pl-4 py-2 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-600"
          />
        </div>
        <div className="text-xs text-slate-500">
          نمایش {toPersianDigits(filtered.length)} از {toPersianDigits(companies.length)} رکورد
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">نام شرکت / هسته</th>
              <th className="py-3.5 px-4">حوزه فعالیت</th>
              <th className="py-3.5 px-4">وضعیت و سطح</th>
              <th className="py-3.5 px-4 text-center">انتشار عمومی</th>
              <th className="py-3.5 px-4 text-center">منتخب</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    <CompanyAvatar company={c} size="sm" />
                    <div>
                      <div className="font-bold text-slate-900">{c.name}</div>
                      <div className="text-xs text-slate-500">
                        شناسه ملی: {toPersianDigits(c.nationalId) || '—'} | مدیرعامل: {c.ceoName || '—'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-xs text-slate-700">{c.field || '—'}</td>
                <td className="py-3.5 px-4">
                  <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800 mb-1">
                    {c.status || 'فعال'}
                  </span>
                  <div className="text-[11px] text-slate-500">{c.level || '—'}</div>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => togglePublish(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
                      c.isPublic
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {c.isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>{c.isPublic ? 'منتشر شده' : 'پیش‌نویس داخلی'}</span>
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => toggleFeatured(c.id)}
                    title="نمایش در شرکت‌های منتخب صفحه اصلی"
                    className={`p-1.5 rounded-lg transition-colors ${
                      c.isFeatured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-amber-400'
                    }`}
                  >
                    <Star className={`w-5 h-5 ${c.isFeatured ? 'fill-amber-400' : ''}`} />
                  </button>
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => onViewPublic(c)}
                      title="مشاهده صفحه شناسنامه"
                      className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onEdit(c)}
                      title="ویرایش کامل اطلاعات"
                      className="p-2 rounded-lg text-amber-600 hover:bg-amber-50"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setHistoryModalCompany(c)}
                      title="تاریخچه تغییرات"
                      className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
                    >
                      <History className="w-4 h-4" />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => handleDelete(c)}
                        title="حذف شرکت"
                        className="p-2 rounded-lg text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* مودال تاریخچه تغییرات */}
      {historyModalCompany && (
        <div className="fixed inset-0 bg-slate-900/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-slate-900">تاریخچه تغییرات: {historyModalCompany.name}</h4>
              <button onClick={() => setHistoryModalCompany(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            {historyModalCompany.history && historyModalCompany.history.length > 0 ? (
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {historyModalCompany.history.map((h, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex justify-between text-slate-500 mb-1">
                      <span>کاربر: <b>{h.user}</b></span>
                      <span>{toPersianDigits(h.date)}</span>
                    </div>
                    <p className="text-slate-800 font-medium">{h.action}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-6 text-center">تاریخچه‌ای برای این رکورد ثبت نشده است.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// --- ج) فرم جامع ۸ تبی ثبت و ویرایش اطلاعات شرکت ---
function AdminCompanyFormTab({ editingCompany, companies, setCompanies, adminUser, onDone, showToast }) {
  const [formTab, setFormTab] = useState(1);

  const emptyCompany = {
    rowNumber: String(companies.length + 1),
    status: 'فعال',
    level: 'سطح ۳ (پیش‌رشد)',
    name: '',
    nationalId: '',
    registrationNumber: '',
    companyType: 'سهامی خاص',
    establishedDate: '',
    registeredCapital: '',
    shortDesc: '',
    logoUrl: '',
    ceoName: '',
    ceoPhone: '',
    ceoNationalId: '',
    ceoBirthDate: '',
    ceoDegree: '',
    ceoUniversity: '',
    chairmanName: '',
    chairmanPhone: '',
    unitNumber: '',
    unitArea: '',
    postalCode: '',
    visitable: 'بله',
    locationStatus: 'مستقر در مرکز رشد',
    workshopCode: '',
    economicCode: '',
    landline: '',
    email: '',
    website: '',
    field: 'هوش مصنوعی و فناوری اطلاعات',
    knowledgeBased: 'خیر',
    recruitmentBase: '',
    techLicense: 'در دست اقدام',
    techLicenseTopic: '',
    productCount: 1,
    products: [{ name: '', brand: '', status: 'نمونه اولیه', description: '', patent: 'ندارد' }],
    initialStaff: 0,
    thirdYearStaff: 0,
    totalStaff: 0,
    femaleStaff: 0,
    targetAudience: '',
    investmentRaised: 'خیر',
    investmentAmount: '',
    revenueModel: '',
    salesYear1: '',
    salesYear2: '',
    salesYear3: '',
    salesYear4: '',
    entryDate: '',
    preIncubationEndDate: '',
    incubationEntryDate: '',
    membershipStatus: 'پیش‌رشد',
    threeYearEndDate: '',
    renewalDate: '',
    exitDate: '',
    exitResult: '',
    notes: '',
    isPublic: false,
    isFeatured: false,
    publishInvestment: false,
    publishSales: false
  };

  const [formData, setFormData] = useState(() => (editingCompany ? { ...emptyCompany, ...editingCompany } : emptyCompany));

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateField('logoUrl', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleProductChange = (idx, field, val) => {
    const updated = [...(formData.products || [])];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData((prev) => ({ ...prev, products: updated, productCount: updated.length }));
  };

  const addProduct = () => {
    const updated = [...(formData.products || []), { name: '', brand: '', status: '', description: '', patent: '' }];
    setFormData((prev) => ({ ...prev, products: updated, productCount: updated.length }));
  };

  const removeProduct = (idx) => {
    const updated = (formData.products || []).filter((_, i) => i !== idx);
    setFormData((prev) => ({ ...prev, products: updated, productCount: updated.length }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.name.trim()) {
      showToast('وارد کردن نام شرکت یا هسته فناور الزامی است.', 'error');
      setFormTab(1);
      return;
    }

    const logEntry = {
      date: new Date().toLocaleDateString('fa-IR'),
      user: adminUser.name,
      action: editingCompany ? 'ویرایش اطلاعات شرکت از طریق فرم دستی' : 'ثبت اولیه شرکت در سامانه'
    };

    if (editingCompany) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === editingCompany.id
            ? { ...formData, history: [logEntry, ...(c.history || [])] }
            : c
        )
      );
      showToast('تغییرات اطلاعات شرکت با موفقیت ذخیره شد.');
    } else {
      const newRecord = {
        ...formData,
        id: 'comp-' + Date.now(),
        slug: generateSlug(formData.name),
        history: [logEntry]
      };
      setCompanies((prev) => [newRecord, ...prev]);
      showToast('شرکت جدید با موفقیت در پایگاه داده ثبت شد.');
    }
    onDone();
  };

  const tabs = [
    { id: 1, title: '۱. اطلاعات هویتی و ثبتی' },
    { id: 2, title: '۲. مدیرعامل و هیئت‌مدیره' },
    { id: 3, title: '۳. استقرار و فضای فیزیکی' },
    { id: 4, title: '۴. فناوری و محصولات' },
    { id: 5, title: '۵. نیروی انسانی' },
    { id: 6, title: '۶. اقتصادی و فروش' },
    { id: 7, title: '۷. عضویت در مرکز رشد' },
    { id: 8, title: '۸. خروج و انتشار' }
  ];

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {editingCompany ? `ویرایش پرونده: ${editingCompany.name}` : 'ثبت پرونده شرکت / هسته فناور جدید'}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            امکان ذخیره اطلاعات ناقص وجود دارد؛ فقط «نام شرکت/هسته فناور» برای ایجاد رکورد الزامی است.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onDone}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-white"
          >
            انصراف
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>ذخیره اطلاعات در پایگاه داده</span>
          </button>
        </div>
      </div>

      {/* تب‌های ۸ گانه فرم */}
      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100/70 px-3 pt-2 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFormTab(t.id)}
            className={`px-3.5 py-2.5 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              formTab === t.id
                ? 'bg-white text-blue-800 border-t border-x border-slate-200 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="p-6">
        {/* تب ۱: هویتی و ثبتی */}
        {formTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                نام شرکت / هسته فناور <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ردیف دفتر</label>
              <input
                type="text"
                value={formData.rowNumber}
                onChange={(e) => updateField('rowNumber', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت شرکت</label>
              <select
                value={formData.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="فعال">فعال</option>
                <option value="در حال پذیرش">در حال پذیرش</option>
                <option value="تعلیق موقت">تعلیق موقت</option>
                <option value="خارج‌شده (موفق)">خارج‌شده (موفق)</option>
                <option value="خارج‌شده (انصراف/عدم تمدید)">خارج‌شده (انصراف/عدم تمدید)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سطح‌بندی شرکت</label>
              <select
                value={formData.level}
                onChange={(e) => updateField('level', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="سطح ۳ (پیش‌رشد)">سطح ۳ (پیش‌رشد)</option>
                <option value="سطح ۲ (رشد مقدماتی)">سطح ۲ (رشد مقدماتی)</option>
                <option value="سطح ۱ (رشد پیشرفته)">سطح ۱ (رشد پیشرفته)</option>
                <option value="فارغ‌التحصیل مرکز رشد">فارغ‌التحصیل مرکز رشد</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نوع شخصیت حقوقی</label>
              <select
                value={formData.companyType}
                onChange={(e) => updateField('companyType', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="سهامی خاص">سهامی خاص</option>
                <option value="مسئولیت محدود">مسئولیت محدود</option>
                <option value="هسته فناور">هسته فناور (فاقد ثبت شرکت)</option>
                <option value="تعاونی دانش‌بنیان">تعاونی دانش‌بنیان</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شناسه ملی</label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) => updateField('nationalId', e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره ثبت</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => updateField('registrationNumber', e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ تأسیس (شمسی)</label>
              <input
                type="text"
                placeholder="مثلاً 1401/06/15"
                value={formData.establishedDate}
                onChange={(e) => updateField('establishedDate', e.target.value)}
                dir="ltr"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">سرمایه ثبتی</label>
              <input
                type="text"
                value={formData.registeredCapital}
                onChange={(e) => updateField('registeredCapital', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">لوگوی شرکت (اختیاری)</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="w-full px-3 py-1.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">معرفی کوتاه شرکت (نمایش در کارت‌های عمومی)</label>
              <textarea
                rows={3}
                value={formData.shortDesc}
                onChange={(e) => updateField('shortDesc', e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
        )}

        {/* تب ۲: مدیرعامل و هیئت‌مدیره */}
        {formTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              اطلاعات این بخش محرمانه تلقی شده و در وب‌سایت عمومی منتشر نمی‌شود.
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نام و نام خانوادگی مدیرعامل</label>
              <input type="text" value={formData.ceoName} onChange={(e) => updateField('ceoName', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره تماس مدیرعامل</label>
              <input type="text" dir="ltr" value={formData.ceoPhone} onChange={(e) => updateField('ceoPhone', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره ملی مدیرعامل</label>
              <input type="text" dir="ltr" value={formData.ceoNationalId} onChange={(e) => updateField('ceoNationalId', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ تولد مدیرعامل (شمسی)</label>
              <input type="text" dir="ltr" placeholder="1368/04/12" value={formData.ceoBirthDate} onChange={(e) => updateField('ceoBirthDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">آخرین مدرک تحصیلی</label>
              <input type="text" value={formData.ceoDegree} onChange={(e) => updateField('ceoDegree', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">دانشگاه محل تحصیل</label>
              <input type="text" value={formData.ceoUniversity} onChange={(e) => updateField('ceoUniversity', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نام رئیس هیئت‌مدیره</label>
              <input type="text" value={formData.chairmanName} onChange={(e) => updateField('chairmanName', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره تماس رئیس هیئت‌مدیره</label>
              <input type="text" dir="ltr" value={formData.chairmanPhone} onChange={(e) => updateField('chairmanPhone', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}

        {/* تب ۳: استقرار و اطلاعات ارتباطی */}
        {formTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره واحد / محل استقرار</label>
              <input type="text" value={formData.unitNumber} onChange={(e) => updateField('unitNumber', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">متراژ واحد</label>
              <input type="text" value={formData.unitArea} onChange={(e) => updateField('unitArea', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت استقرار</label>
              <select value={formData.locationStatus} onChange={(e) => updateField('locationStatus', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option value="مستقر در مرکز رشد">مستقر در مرکز رشد</option>
                <option value="مستقر در فضای اشتراکی">مستقر در فضای اشتراکی</option>
                <option value="غیرمستقر (مجازی)">غیرمستقر (مجازی)</option>
                <option value="مستقر در پارک فناوری">مستقر در پارک فناوری</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">کدپستی</label>
              <input type="text" dir="ltr" value={formData.postalCode} onChange={(e) => updateField('postalCode', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">قابلیت بازدید</label>
              <select value={formData.visitable} onChange={(e) => updateField('visitable', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm bg-white">
                <option value="بله">بله</option>
                <option value="خیر">خیر</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">کد کارگاهی</label>
              <input type="text" dir="ltr" value={formData.workshopCode} onChange={(e) => updateField('workshopCode', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">کد اقتصادی</label>
              <input type="text" dir="ltr" value={formData.economicCode} onChange={(e) => updateField('economicCode', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">شماره ثابت</label>
              <input type="text" dir="ltr" value={formData.landline} onChange={(e) => updateField('landline', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">ایمیل رسمی شرکت</label>
              <input type="email" dir="ltr" value={formData.email} onChange={(e) => updateField('email', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">آدرس وبگاه</label>
              <input type="text" dir="ltr" placeholder="https://example.ir" value={formData.website} onChange={(e) => updateField('website', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}

        {/* تب ۴: فناوری و محصولات متعدد */}
        {formTab === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">حوزه فعالیت</label>
                <input type="text" value={formData.field} onChange={(e) => updateField('field', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت دانش‌بنیان</label>
                <input type="text" value={formData.knowledgeBased} onChange={(e) => updateField('knowledgeBased', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">پایگاه جذب</label>
                <input type="text" value={formData.recruitmentBase} onChange={(e) => updateField('recruitmentBase', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">مجوز فناوری</label>
                <input type="text" value={formData.techLicense} onChange={(e) => updateField('techLicense', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">موضوع مجوز یا عنوان پیشنهادی مجوز فناوری</label>
                <input type="text" value={formData.techLicenseTopic} onChange={(e) => updateField('techLicenseTopic', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-bold text-sm text-slate-900">فهرست محصولات و خدمات شرکت</h4>
                <button
                  type="button"
                  onClick={addProduct}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  افزودن محصول جدید
                </button>
              </div>

              <div className="space-y-4">
                {(formData.products || []).map((prod, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative">
                    {formData.products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(idx)}
                        className="absolute top-3 left-3 text-rose-500 hover:text-rose-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">نام محصول</label>
                        <input type="text" value={prod.name} onChange={(e) => handleProductChange(idx, 'name', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">نام برند</label>
                        <input type="text" value={prod.brand} onChange={(e) => handleProductChange(idx, 'brand', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">آخرین وضعیت محصول</label>
                        <input type="text" value={prod.status} onChange={(e) => handleProductChange(idx, 'status', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">ثبت اختراع</label>
                        <input type="text" value={prod.patent} onChange={(e) => handleProductChange(idx, 'patent', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">توضیحات فنی محصول</label>
                      <input type="text" value={prod.description} onChange={(e) => handleProductChange(idx, 'description', e.target.value)} className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs bg-white" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* تب ۵: نیروی انسانی */}
        {formTab === 5 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نیروی انسانی ابتدای ورود</label>
              <input type="number" value={formData.initialStaff} onChange={(e) => updateField('initialStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">نیروی انسانی انتهای سال سوم</label>
              <input type="number" value={formData.thirdYearStaff} onChange={(e) => updateField('thirdYearStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تعداد کل نیروی انسانی سال</label>
              <input type="number" value={formData.totalStaff} onChange={(e) => updateField('totalStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تعداد بانوان</label>
              <input type="number" value={formData.femaleStaff} onChange={(e) => updateField('femaleStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}

        {/* تب ۶: اقتصادی و فروش */}
        {formTab === 6 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">گروه مخاطب و مشتریان</label>
              <input type="text" value={formData.targetAudience} onChange={(e) => updateField('targetAudience', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت جذب سرمایه</label>
              <input type="text" value={formData.investmentRaised} onChange={(e) => updateField('investmentRaised', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">میزان سرمایه‌گذاری</label>
              <input type="text" value={formData.investmentAmount} onChange={(e) => updateField('investmentAmount', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">مدل درآمدی</label>
              <input type="text" value={formData.revenueModel} onChange={(e) => updateField('revenueModel', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">فروش سال اول</label>
              <input type="text" value={formData.salesYear1} onChange={(e) => updateField('salesYear1', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">فروش سال دوم</label>
              <input type="text" value={formData.salesYear2} onChange={(e) => updateField('salesYear2', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">فروش سال سوم</label>
              <input type="text" value={formData.salesYear3} onChange={(e) => updateField('salesYear3', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">فروش سال چهارم</label>
              <input type="text" value={formData.salesYear4} onChange={(e) => updateField('salesYear4', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}

        {/* تب ۷: عضویت در مرکز رشد */}
        {formTab === 7 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ ورود به مرکز رشد</label>
              <input type="text" dir="ltr" placeholder="1401/05/01" value={formData.entryDate} onChange={(e) => updateField('entryDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ اتمام پیش‌رشد</label>
              <input type="text" dir="ltr" value={formData.preIncubationEndDate} onChange={(e) => updateField('preIncubationEndDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ ورود به دوره رشد</label>
              <input type="text" dir="ltr" value={formData.incubationEntryDate} onChange={(e) => updateField('incubationEntryDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت شرکت در مرکز</label>
              <input type="text" value={formData.membershipStatus} onChange={(e) => updateField('membershipStatus', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">پایان سه سال عضویت</label>
              <input type="text" dir="ltr" value={formData.threeYearEndDate} onChange={(e) => updateField('threeYearEndDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">تمدید عضویت</label>
              <input type="text" dir="ltr" value={formData.renewalDate} onChange={(e) => updateField('renewalDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}

        {/* تب ۸: خروج و تنظیمات انتشار */}
        {formTab === 8 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ خروج</label>
                <input type="text" dir="ltr" value={formData.exitDate} onChange={(e) => updateField('exitDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">نتیجه خروج</label>
                <input type="text" value={formData.exitResult} onChange={(e) => updateField('exitResult', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">توضیحات تکمیلی</label>
                <textarea rows={3} value={formData.notes} onChange={(e) => updateField('notes', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-3">
              <h4 className="font-bold text-sm text-blue-950">تنظیمات انتشار عمومی شناسنامه شرکت</h4>
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => updateField('isPublic', e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                <span>انتشار صفحه معرفی شرکت در وب‌سایت عمومی مرکز رشد</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                <span>نمایش در بخش «شرکت‌های منتخب» صفحه اصلی</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.publishInvestment} onChange={(e) => updateField('publishInvestment', e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                <span>مجوز انتشار مبلغ جذب سرمایه در صفحه عمومی</span>
              </label>
              <label className="flex items-center gap-2.5 text-sm cursor-pointer">
                <input type="checkbox" checked={formData.publishSales} onChange={(e) => updateField('publishSales', e.target.checked)} className="w-4 h-4 rounded text-blue-600" />
                <span>مجوز انتشار آمار فروش سالانه در صفحه عمومی</span>
              </label>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

// --- د) سامانه هوشمند بارگذاری و نگاشت فایل اکسل (XLSX / XLS) ---
function AdminExcelImportTab({ companies, setCompanies, adminUser, onDone, showToast }) {
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({}); // { excelHeader: dbFieldKey }
  const [selectedRowIndices, setSelectedRowIndices] = useState([]);
  const [duplicateMode, setDuplicateMode] = useState('update'); // update | skip
  const [publishOnImport, setPublishOnImport] = useState(true);
  const [importSummary, setImportSummary] = useState(null);

  // دانلود فایل نمونه اکسل مطابق ستون‌های مرکز رشد
  const downloadSampleExcel = () => {
    const sampleData = [
      {
        'ردیف': 1,
        'وضعیت': 'فعال',
        'سطح‌بندی': 'سطح ۲ (رشد مقدماتی)',
        'نام شرکت/هسته فناور': 'پردازش داده هوشمند البرز',
        'شناسه ملی': '14009988776',
        'شماره ثبت': '589632',
        'نوع شرکت': 'سهامی خاص',
        'تاریخ تأسیس': '1401/03/10',
        'سرمایه ثبتی': '۳,۰۰۰,۰۰۰,۰۰۰ ریال',
        'نام مدیرعامل': 'مهندس سینا تهرانی',
        'شماره تماس': '09125554433',
        'شماره ملی مدیرعامل': '0078945612',
        'تاریخ تولد': '1369/08/20',
        'آخرین مدرک تحصیلی': 'کارشناسی ارشد نرم‌افزار',
        'دانشگاه محل تحصیل': 'دانشگاه صنعتی شریف',
        'نام رئیس هیئت‌مدیره': 'دکتر کامران نیکو',
        'شماره تماس رئیس هیئت‌مدیره': '09121119988',
        'شماره واحد': 'واحد ۲۰۵',
        'متراژ واحد': '۵۰ مترمربع',
        'کدپستی': '1657145205',
        'قابلیت بازدید': 'بله',
        'کد کارگاهی': '0214589888',
        'کد اقتصادی': '411998877665',
        'شماره ثابت': '021-76250505',
        'ایمیل رسمی شرکت': 'info@alborz-data.ir',
        'آدرس وبگاه': 'https://alborz-data.ir',
        'نیروی انسانی ابتدای ورود': 3,
        'نیروی انسانی انتهای سال سوم': 12,
        'تعداد کل نیروی انسانی سال': 15,
        'تعداد بانوان': 6,
        'دانش‌بنیان': 'دانش‌بنیان نوپا',
        'پایگاه جذب': 'فراخوان ۲۲ مرکز رشد',
        'حوزه فعالیت': 'هوش مصنوعی و فناوری اطلاعات',
        'مجوز فناوری': 'دارد',
        'موضوع مجوز یا عنوان پیشنهادی مجوز فناوری': 'سامانه پایش هوشمند مصرف انرژی صنایع',
        'تعداد محصول': 2,
        'نام محصولات': 'سامانه پایش انرژی ابری',
        'نام برند': 'AlborzEMS',
        'ثبت اختراع': 'ندارد',
        'آخرین وضعیت محصول': 'تجاری‌سازی شده',
        'تاریخ ورود به مرکز رشد': '1401/07/01',
        'تاریخ اتمام پیش‌رشد': '1402/01/01',
        'تاریخ ورود به دوره رشد': '1402/01/15',
        'وضعیت شرکت': 'دوره رشد',
        'پایان سه سال عضویت': '1405/01/15',
        'تمدید عضویت': '',
        'گروه مخاطب': 'صنایع فولاد، سیمان و ساختمان‌های اداری',
        'جذب سرمایه': 'بله',
        'میزان سرمایه‌گذاری': '۵ میلیارد تومان',
        'مدل درآمدی': 'اشتراک سالانه نرم‌افزار (SaaS)',
        'فروش سال اول': '۱.۵ میلیارد تومان',
        'فروش سال دوم': '۴.۲ میلیارد تومان',
        'فروش سال سوم': '',
        'فروش سال چهارم': '',
        'تاریخ خروج': '',
        'نتیجه خروج': '',
        'توضیحات': 'رکورد نمونه جهت تست ورود اطلاعات از اکسل'
      }
    ];
    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'فهرست شرکت‌ها');
    XLSX.writeFile(wb, 'Sample_Nokhbegan_Import.xlsx');
  };

  // پردازش فایل اکسل آپلود شده
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!jsonRows || jsonRows.length === 0) {
          showToast('فایل اکسل انتخاب‌شده خالی است.', 'error');
          return;
        }

        const headers = Object.keys(jsonRows[0]);
        setExcelHeaders(headers);
        setRawRows(jsonRows);
        setSelectedRowIndices(jsonRows.map((_, idx) => idx));
        setImportSummary(null);

        // تطبیق هوشمند ستون‌های فارسی فارغ از ترتیب ستون‌ها
        const autoMap = {};
        headers.forEach((header) => {
          const cleanH = header.trim().replace(/\u200c/g, ' ').replace(/\s+/g, ' ');
          const matchedDef = DB_FIELD_DEFINITIONS.find((def) =>
            def.aliases.some((alias) => {
              const cleanA = alias.trim().replace(/\u200c/g, ' ').replace(/\s+/g, ' ');
              return cleanA === cleanH || cleanH.includes(cleanA);
            })
          );
          autoMap[header] = matchedDef ? matchedDef.key : '';
        });

        setColumnMapping(autoMap);
        showToast(`${toPersianDigits(jsonRows.length)} ردیف از فایل اکسل خوانده شد.`);
      } catch (err) {
        console.error(err);
        showToast('خطا در خواندن فایل اکسل. لطفاً فرمت XLSX یا XLS معتبر انتخاب کنید.', 'error');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // پیش‌نمایش ردیف‌های تبدیل‌شده همراه با وضعیت تکراری یا ناقص بودن
  const previewRows = useMemo(() => {
    const existingNationalIds = new Set(companies.map((c) => String(c.nationalId || '').trim()).filter(Boolean));
    const existingNames = new Set(companies.map((c) => String(c.name || '').trim()).filter(Boolean));

    return rawRows.map((row, idx) => {
      const mappedObj = {};
      Object.entries(columnMapping).forEach(([excelCol, dbKey]) => {
        if (dbKey) {
          mappedObj[dbKey] = row[excelCol];
        }
      });

      const nameVal = String(mappedObj.name || '').trim();
      const natIdVal = String(mappedObj.nationalId || '').trim();

      const isMissingName = !nameVal;
      const isDuplicate =
        (!isMissingName && existingNames.has(nameVal)) ||
        (natIdVal && existingNationalIds.has(natIdVal));

      return {
        index: idx,
        mapped: mappedObj,
        isMissingName,
        isDuplicate
      };
    });
  }, [rawRows, columnMapping, companies]);

  const toggleRowSelection = (idx) => {
    setSelectedRowIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  // اجرای نهایی ورود به پایگاه داده
  const handleConfirmImport = () => {
    let successCount = 0;
    let updatedCount = 0;
    const failedRows = [];
    let updatedCompanies = [...companies];

    previewRows.forEach((item) => {
      if (!selectedRowIndices.includes(item.index)) return;

      if (item.isMissingName) {
        failedRows.push({
          ...rawRows[item.index],
          'علت خطا': 'ستون نام شرکت/هسته فناور خالی است'
        });
        return;
      }

      const m = item.mapped;
      const nameStr = String(m.name || '').trim();
      const natIdStr = String(m.nationalId || '').trim();

      const existingIdx = updatedCompanies.findIndex(
        (c) =>
          (natIdStr && String(c.nationalId || '').trim() === natIdStr) ||
          String(c.name || '').trim() === nameStr
      );

      if (existingIdx !== -1 && duplicateMode === 'skip') {
        failedRows.push({
          ...rawRows[item.index],
          'علت خطا': 'رکورد تکراری بر اساس شناسه ملی یا نام شرکت (نادیده گرفته شد)'
        });
        return;
      }

      // ساخت آرایه محصولات از ستون‌های متنی اکسل
      const prodNames = String(m.productNamesRaw || '')
        .split(/[,،\n]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const constructedProducts =
        prodNames.length > 0
          ? prodNames.map((pName) => ({
              name: pName,
              brand: String(m.brandNamesRaw || ''),
              status: String(m.productStatusRaw || 'ثبت‌شده از اکسل'),
              description: String(m.techLicenseTopic || ''),
              patent: String(m.patentRaw || '')
            }))
          : [];

      const recordPayload = {
        rowNumber: String(m.rowNumber || updatedCompanies.length + 1),
        status: String(m.status || 'فعال'),
        level: String(m.level || 'سطح ۲ (رشد مقدماتی)'),
        name: nameStr,
        nationalId: natIdStr,
        registrationNumber: String(m.registrationNumber || ''),
        companyType: String(m.companyType || 'سهامی خاص'),
        establishedDate: String(m.establishedDate || ''),
        registeredCapital: String(m.registeredCapital || ''),
        shortDesc:
          String(m.shortDesc || '') ||
          (m.techLicenseTopic ? `فعال در زمینه ${m.techLicenseTopic}` : `واحد فناور فعال در حوزه ${m.field || 'فناوری'}`),
        ceoName: String(m.ceoName || ''),
        ceoPhone: String(m.ceoPhone || ''),
        ceoNationalId: String(m.ceoNationalId || ''),
        ceoBirthDate: String(m.ceoBirthDate || ''),
        ceoDegree: String(m.ceoDegree || ''),
        ceoUniversity: String(m.ceoUniversity || ''),
        chairmanName: String(m.chairmanName || ''),
        chairmanPhone: String(m.chairmanPhone || ''),
        unitNumber: String(m.unitNumber || ''),
        unitArea: String(m.unitArea || ''),
        postalCode: String(m.postalCode || ''),
        visitable: String(m.visitable || 'بله'),
        locationStatus: String(m.locationStatus || 'مستقر در مرکز رشد'),
        workshopCode: String(m.workshopCode || ''),
        economicCode: String(m.economicCode || ''),
        landline: String(m.landline || ''),
        email: String(m.email || ''),
        website: String(m.website || ''),
        initialStaff: Number(m.initialStaff) || 0,
        thirdYearStaff: Number(m.thirdYearStaff) || 0,
        totalStaff: Number(m.totalStaff) || 0,
        femaleStaff: Number(m.femaleStaff) || 0,
        knowledgeBased: String(m.knowledgeBased || 'خیر'),
        recruitmentBase: String(m.recruitmentBase || ''),
        field: String(m.field || 'سایر حوزه‌های فناوری'),
        techLicense: String(m.techLicense || ''),
        techLicenseTopic: String(m.techLicenseTopic || ''),
        productCount: Number(m.productCount) || constructedProducts.length,
        products: constructedProducts,
        entryDate: String(m.entryDate || ''),
        preIncubationEndDate: String(m.preIncubationEndDate || ''),
        incubationEntryDate: String(m.incubationEntryDate || ''),
        membershipStatus: String(m.membershipStatus || m.status || 'دوره رشد'),
        threeYearEndDate: String(m.threeYearEndDate || ''),
        renewalDate: String(m.renewalDate || ''),
        targetAudience: String(m.targetAudience || ''),
        investmentRaised: String(m.investmentRaised || ''),
        investmentAmount: String(m.investmentAmount || ''),
        revenueModel: String(m.revenueModel || ''),
        salesYear1: String(m.salesYear1 || ''),
        salesYear2: String(m.salesYear2 || ''),
        salesYear3: String(m.salesYear3 || ''),
        salesYear4: String(m.salesYear4 || ''),
        exitDate: String(m.exitDate || ''),
        exitResult: String(m.exitResult || ''),
        notes: String(m.notes || ''),
        isPublic: publishOnImport,
        isFeatured: false,
        publishInvestment: false,
        publishSales: false
      };

      const logEntry = {
        date: new Date().toLocaleDateString('fa-IR'),
        user: adminUser.name,
        action: existingIdx !== -1 ? 'به‌روزرسانی از طریق فایل اکسل' : 'ایجاد خودکار از طریق فایل اکسل'
      };

      if (existingIdx !== -1) {
        updatedCompanies[existingIdx] = {
          ...updatedCompanies[existingIdx],
          ...recordPayload,
          history: [logEntry, ...(updatedCompanies[existingIdx].history || [])]
        };
        updatedCount++;
      } else {
        updatedCompanies.unshift({
          ...recordPayload,
          id: 'comp-' + Date.now() + '-' + item.index,
          slug: generateSlug(nameStr),
          logoUrl: '',
          history: [logEntry]
        });
        successCount++;
      }
    });

    setCompanies(updatedCompanies);
    setImportSummary({
      successCount,
      updatedCount,
      failedRows
    });
    showToast(`عملیات پردازش اکسل انجام شد: ${toPersianDigits(successCount + updatedCount)} رکورد ثبت/به‌روزرسانی شد.`);
  };

  const downloadErrorReport = () => {
    if (!importSummary || importSummary.failedRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(importSummary.failedRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'خطاهای ورود اطلاعات');
    XLSX.writeFile(wb, 'Excel_Import_Errors.xlsx');
  };

  return (
    <div className="space-y-6">
      {/* بخش آپلود فایل */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              ورود گروهی اطلاعات شرکت‌ها از فایل اکسل (XLSX / XLS)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              سامانه به‌صورت خودکار عناوین فارسی ستون‌های اکسل را شناسایی می‌کند (ترتیب ستون‌ها اهمیتی ندارد).
            </p>
          </div>
          <button
            type="button"
            onClick={downloadSampleExcel}
            className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-semibold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>دانلود فایل نمونه اکسل با ستون‌های استاندارد</span>
          </button>
        </div>

        <label className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-slate-50/70 transition-colors">
          <Upload className="w-10 h-10 text-blue-600 mb-3" />
          <span className="text-sm font-bold text-slate-800 mb-1">
            برای انتخاب فایل اکسل کلیک کنید یا فایل را اینجا رها کنید
          </span>
          <span className="text-xs text-slate-500">پشتیبانی از فرمت‌های .xlsx و .xls</span>
          <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      {/* گزارش نتیجه نهایی */}
      {importSummary && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              گزارش انتقال داده‌های اکسل به پایگاه داده
            </h4>
            <p className="text-xs text-emerald-800">
              • شرکت‌های جدید ایجادشده: <b>{toPersianDigits(importSummary.successCount)}</b> مورد |
              • شرکت‌های موجود به‌روزرسانی‌شده: <b>{toPersianDigits(importSummary.updatedCount)}</b> مورد |
              • ردیف‌های ناموفق/نادیده‌گرفته‌شده: <b>{toPersianDigits(importSummary.failedRows.length)}</b> مورد
            </p>
          </div>
          <div className="flex items-center gap-2">
            {importSummary.failedRows.length > 0 && (
              <button
                onClick={downloadErrorReport}
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                دانلود فایل خطاها
              </button>
            )}
            <button
              onClick={onDone}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold"
            >
              مشاهده فهرست شرکت‌ها
            </button>
          </div>
        </div>
      )}

      {/* مرحله نگاشت ستون‌ها و پیش‌نمایش */}
      {rawRows.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 bg-slate-50">
            <h4 className="font-bold text-sm text-slate-900 mb-3">
              ۱. تطبیق و اصلاح نگاشت ستون‌های اکسل ({toPersianDigits(excelHeaders.length)} ستون شناسایی شد)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
              {excelHeaders.map((header) => (
                <div key={header} className="p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
                  <span className="text-slate-500 block mb-1 truncate" title={header}>
                    ستون اکسل: <b className="text-slate-800">{header}</b>
                  </span>
                  <select
                    value={columnMapping[header] || ''}
                    onChange={(e) => setColumnMapping((prev) => ({ ...prev, [header]: e.target.value }))}
                    className={`w-full px-2 py-1.5 rounded-lg border text-xs ${
                      columnMapping[header] ? 'border-emerald-300 bg-emerald-50/50 text-emerald-950 font-semibold' : 'border-slate-300 text-slate-500'
                    }`}
                  >
                    <option value="">— نادیده گرفتن این ستون —</option>
                    {DB_FIELD_DEFINITIONS.map((def) => (
                      <option key={def.key} value={def.key}>
                        {def.label} ({def.group})
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* تنظیمات تکراری‌ها و پیش‌نمایش ردیف‌ها */}
          <div className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">رفتار با شرکت‌های تکراری (شناسه ملی/نام یکسان):</span>
                  <select
                    value={duplicateMode}
                    onChange={(e) => setDuplicateMode(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value="update">به‌روزرسانی اطلاعات شرکت موجود</option>
                    <option value="skip">نادیده گرفتن و ثبت در گزارش خطا</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={publishOnImport}
                    onChange={(e) => setPublishOnImport(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <span>تولید و انتشار خودکار صفحه معرفی عمومی پس از ثبت</span>
                </label>
              </div>

              <button
                type="button"
                onClick={handleConfirmImport}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                <span>تأیید و انتقال {toPersianDigits(selectedRowIndices.length)} ردیف به پایگاه داده</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl max-h-96">
              <table className="w-full text-right text-xs">
                <thead className="bg-slate-100 text-slate-700 sticky top-0">
                  <tr>
                    <th className="p-3 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={selectedRowIndices.length === rawRows.length}
                        onChange={(e) =>
                          setSelectedRowIndices(e.target.checked ? rawRows.map((_, i) => i) : [])
                        }
                      />
                    </th>
                    <th className="p-3">وضعیت اعتبارسنجی</th>
                    <th className="p-3">نام شرکت / هسته فناور</th>
                    <th className="p-3">شناسه ملی</th>
                    <th className="p-3">حوزه فعالیت</th>
                    <th className="p-3">مدیرعامل</th>
                    <th className="p-3">نیروی انسانی</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {previewRows.map((item) => (
                    <tr
                      key={item.index}
                      className={
                        item.isMissingName
                          ? 'bg-rose-50/70'
                          : item.isDuplicate
                          ? 'bg-amber-50/70'
                          : 'hover:bg-slate-50'
                      }
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRowIndices.includes(item.index)}
                          onChange={() => toggleRowSelection(item.index)}
                        />
                      </td>
                      <td className="p-3">
                        {item.isMissingName ? (
                          <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
                            ناقص (بدون نام)
                          </span>
                        ) : item.isDuplicate ? (
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                            تکراری ({duplicateMode === 'update' ? 'به‌روزرسانی' : 'رد می‌شود'})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                            جدید و معتبر
                          </span>
                        )}
                      </td>
                      <td className="p-3 font-bold text-slate-900">{item.mapped.name || '—'}</td>
                      <td className="p-3 font-mono">{toPersianDigits(item.mapped.nationalId) || '—'}</td>
                      <td className="p-3">{item.mapped.field || '—'}</td>
                      <td className="p-3">{item.mapped.ceoName || '—'}</td>
                      <td className="p-3">{toPersianDigits(item.mapped.totalStaff || 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- هـ) تنظیمات سطوح دسترسی، محرمانگی و مدیریت داده‌های آزمایشی ---
function AdminSettingsTab({
  companies,
  setCompanies,
  accessPolicies,
  setAccessPolicies,
  isSuperAdmin,
  onBackupJson,
  onExportExcel,
  showToast
}) {
  const handleClearDemoData = () => {
    if (!isSuperAdmin) {
      showToast('فقط مدیر کل سامانه مجوز پاک‌سازی پایگاه داده را دارد.', 'error');
      return;
    }
    if (
      window.confirm(
        'آیا مطمئن هستید که می‌خواهید تمامی داده‌های آزمایشی فعلی را حذف کنید تا پایگاه داده برای بارگذاری اطلاعات واقعی آماده شود؟'
      )
    ) {
      setCompanies([]);
      showToast('تمامی داده‌های آزمایشی حذف شدند. اکنون می‌توانید فایل اکسل واقعی خود را بارگذاری کنید.');
    }
  };

  const handleRestoreDemoData = () => {
    setCompanies(INITIAL_COMPANIES);
    showToast('داده‌های آزمایشی اولیه بازیابی شدند.');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* تنظیمات سطوح محرمانگی */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Lock className="w-5 h-5 text-blue-600" />
          ماتریس سطوح دسترسی و محرمانگی اطلاعات
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          تعیین سطح نمایش هر دسته از اطلاعات در وب‌سایت عمومی مرکز رشد:
        </p>

        <div className="space-y-4 text-sm">
          {[
            {
              key: 'ceoPersonal',
              title: 'اطلاعات شخصی مدیرعامل و هیئت‌مدیره',
              desc: 'شماره ملی، تاریخ تولد، موبایل مدیرعامل و رئیس هیئت‌مدیره'
            },
            {
              key: 'financialCodes',
              title: 'کدهای ثبتی و مالیاتی محرمانه',
              desc: 'کد اقتصادی، کد کارگاهی و کدپستی دقیق واحد'
            },
            {
              key: 'salesData',
              title: 'اطلاعات فروش سالانه (سال اول تا چهارم)',
              desc: 'نمایش صرفاً در صورت تأیید مدیر برای هر شرکت'
            },
            {
              key: 'investmentData',
              title: 'میزان سرمایه‌گذاری جذب‌شده',
              desc: 'نمایش عمومی در صورت مجاز بودن انتشار'
            }
          ].map((policy) => (
            <div key={policy.key} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-slate-800 text-xs">{policy.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{policy.desc}</div>
              </div>
              <select
                disabled={!isSuperAdmin}
                value={accessPolicies[policy.key]}
                onChange={(e) => {
                  setAccessPolicies((prev) => ({ ...prev, [policy.key]: e.target.value }));
                  showToast('سیاست دسترسی به‌روزرسانی شد.');
                }}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-semibold"
              >
                <option value="admin_only">فقط مدیران</option>
                <option value="conditional">مشروط به تأیید مدیر</option>
                <option value="public">عمومی</option>
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* پشتیبان‌گیری و مدیریت داده‌های آزمایشی */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Database className="w-5 h-5 text-emerald-600" />
            مدیریت پایگاه داده و انتقال به داده‌های واقعی
          </h3>
          <p className="text-xs text-slate-500 mb-5 leading-6">
            برای شروع بهره‌برداری عملیاتی، می‌توانید ابتدا از داده‌های فعلی نسخه پشتیبان تهیه کرده، داده‌های آزمایشی را پاک‌سازی کنید و فایل اکسل جامع مرکز رشد را وارد نمایید.
          </p>

          <div className="space-y-3">
            <button
              onClick={onExportExcel}
              className="w-full py-3 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold flex items-center justify-between"
            >
              <span>دریافت خروجی کامل اکسل از پایگاه داده (XLSX)</span>
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onBackupJson}
              className="w-full py-3 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-xs font-bold flex items-center justify-between"
            >
              <span>تهیه نسخه پشتیبان کامل (فایل JSON)</span>
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="mt-8 pt-5 border-t border-slate-200 space-y-3">
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
            <h4 className="text-xs font-bold text-rose-900 mb-1">حذف داده‌های آزمایشی اولیه</h4>
            <p className="text-[11px] text-rose-700 mb-3">
              با زدن این دکمه، ۵ شرکت نمونه اولیه پاک می‌شوند تا پایگاه داده برای ورود اطلاعات واقعی مرکز رشد آماده شود.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleClearDemoData}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                حذف کامل داده‌های آزمایشی
              </button>
              {companies.length === 0 && (
                <button
                  onClick={handleRestoreDemoData}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  بازیابی داده‌های نمونه
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
