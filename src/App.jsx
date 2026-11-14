import React, { useState, useEffect, useMemo } from 'react';
import {
  Building2, Users, Award, Package, Layers, Search,
  ChevronLeft, ChevronDown, ArrowRight, Shield, Lock, Plus, Edit,
  Trash2, Upload, Download, CheckCircle, AlertCircle, X,
  BarChart3, Settings, Eye, EyeOff, Globe, Phone,
  MapPin, Calendar, FileText,
  Check, Star, FileSpreadsheet, Printer,
  History, Sparkles, SlidersHorizontal,
  Mail, Inbox, Send, GitBranch, FileEdit, Archive, BookOpen,
  FilePlus2, Bell, PanelRightClose, PanelRightOpen, Menu,
  Clock, AlertTriangle, UserCheck,
  FileCode, CheckSquare, CornerUpLeft
} from 'lucide-react';

// ============================================================================
// ۱. داده‌های اولیه شرکت‌ها
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
  ceoPersonal: 'admin_only',
  financialCodes: 'admin_only',
  salesData: 'conditional',
  investmentData: 'conditional',
  staffDetails: 'public',
  membershipDates: 'public'
};

// ============================================================================
// ۲. داده‌ها و ثابت‌های ماژول «دبیرخانه الکترونیکی»
// ============================================================================
const SECRETARIAT_ROLES = [
  { id: 'system_admin', label: 'مدیر سیستم', userDisplayName: 'مهندس محمدی (مدیر سیستم)', level: 5 },
  { id: 'secretariat_officer', label: 'مسئول دبیرخانه', userDisplayName: 'سرکار خانم کریمی (مسئول دبیرخانه)', level: 4 },
  { id: 'org_manager', label: 'مدیر مجموعه', userDisplayName: 'دکتر رضایی (رئیس مرکز رشد)', level: 4 },
  { id: 'expert', label: 'کارشناسان', userDisplayName: 'مهندس حسینی (کارشناس ارزیابی و پذیرش)', level: 2 },
  { id: 'viewer', label: 'کاربران مشاهده‌کننده', userDisplayName: 'کاربر مهمان / ناظر', level: 1 }
];

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

const INITIAL_TEMPLATES = [
  {
    id: 'tpl-1',
    title: 'معرفی‌نامه رسمی شرکت عضو مرکز رشد',
    category: 'امور شرکت‌ها',
    subjectTemplate: 'معرفی شرکت {{گیرنده}} جهت بهره‌مندی از تسهیلات و حمایت‌های فناورانه',
    bodyTemplate: 'با سلام و احترام؛\n\nبدین‌وسیله به استحضار می‌رساند شرکت «{{گیرنده}}» از واحدهای فناور مستقر و فعال در مرکز رشد فناوری نخبگان پارک فناوری پردیس می‌باشد.\n\nبا توجه به توانمندی‌های فنی و دستاوردهای دانش‌بنیان آن مجموعه در حوزه {{موضوع}}، خواهشمند است دستور فرمایید مساعدت و همکاری لازم در چارچوب ضوابط و مقررات مربوطه مبذول گردد.\n\nپیشاپیش از حسن توجه و همکاری جناب‌عالی سپاسگزاری می‌نماید.',
    signerName: 'دکتر حمیدرضا رضایی',
    signerTitle: 'رئیس مرکز رشد فناوری نخبگان'
  },
  {
    id: 'tpl-2',
    title: 'ابلاغیه تمدید قرارداد استقرار در مرکز رشد',
    category: 'قراردادها و استقرار',
    subjectTemplate: 'موافقت با تمدید دوره استقرار شرکت {{گیرنده}}',
    bodyTemplate: 'با سلام و احترام؛\n\nعطف به مصوبه شورای فناوری مرکز رشد فناوری نخبگان و بررسی گزارش عملکرد دوره‌ای آن شرکت، بدین‌وسیله با تمدید قرارداد استقرار شرکت «{{گیرنده}}» به مدت یک سال موافقت می‌گردد.\n\nمقتضی است نماینده محترم آن شرکت ظرف مدت ۱۰ روز کاری جهت تکمیل مستندات و امضای الحاقیه قرارداد به دبیرخانه مرکز رشد مراجعه نماید.',
    signerName: 'دکتر حمیدرضا رضایی',
    signerTitle: 'رئیس مرکز رشد فناوری نخبگان'
  },
  {
    id: 'tpl-3',
    title: 'دعوت‌نامه حضور در جلسه شورای ارزیابی و داوری',
    category: 'جلسات و شوراها',
    subjectTemplate: 'دعوت به جلسه ارائه و دفاع فنی — {{موضوع}}',
    bodyTemplate: 'با سلام و احترام؛\n\nبدین‌وسیله از جناب‌عالی / سرکار عالی دعوت به عمل می‌آید تا در جلسه کمیته تخصصی ارزیابی هسته‌ها و شرکت‌های فناور مرکز رشد فناوری نخبگان حضور به هم رسانید.\n\nخواهشمند است مستندات فنی و فایل ارائه (Pitch Deck) خود را حداکثر ۲۴ ساعت پیش از برگزاری جلسه به دبیرخانه ارسال فرمایید.',
    signerName: 'سرکار خانم مریم کریمی',
    signerTitle: 'مسئول دبیرخانه مرکز رشد فناوری نخبگان'
  },
  {
    id: 'tpl-4',
    title: 'پاسخ استعلام وضعیت عضویت و استقرار',
    category: 'پاسخ استعلامات',
    subjectTemplate: 'پاسخ به استعلام شماره {{موضوع}} در خصوص وضعیت استقرار شرکت',
    bodyTemplate: 'با سلام و احترام؛\n\nبازگشت به نامه شماره {{موضوع}}، به استحضار می‌رساند شرکت مورد استعلام در حال حاضر دارای قرارداد استقرار معتبر در مرکز رشد فناوری نخبگان پارک فناوری پردیس بوده و فعالیت‌های تحقیق و توسعه خود را مطابق برنامه مصوب دنبال می‌نماید.',
    signerName: 'دکتر حمیدرضا رضایی',
    signerTitle: 'رئیس مرکز رشد فناوری نخبگان'
  }
];

const INITIAL_SECRETARIAT_STATE = {
  settings: {
    currentYear: '1405',
    incomingPattern: '{YEAR}/و/{SEQ}',
    outgoingPattern: '{YEAR}/ص/{SEQ}',
    internalPattern: '{YEAR}/د/{SEQ}',
    nextIncomingSeq: 1004,
    nextOutgoingSeq: 2003,
    nextInternalSeq: 3002,
    orgHeaderTitle: 'معاونت علمی، فناوری و اقتصاد دانش‌بنیان ریاست جمهوری',
    orgSubTitle: 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان'
  },
  templates: INITIAL_TEMPLATES,
  letters: [
    {
      id: 'let-101',
      type: 'incoming',
      indicatorNumber: '1405/و/1001',
      year: '1405',
      seqNumber: 1001,
      senderType: 'حقوقی',
      senderName: 'دکتر امیرحسین کاظمی',
      senderOrg: 'پارس هوش مصنوعی پردیس',
      originLetterNumber: 'پ‌هـ/۱۴۰۵/۱۱۲',
      letterDate: '1405/01/18',
      receiptDate: '1405/01/19',
      recipientName: 'دکتر حمیدرضا رضایی',
      recipientOrg: 'مرکز رشد فناوری نخبگان',
      subject: 'درخواست تمدید قرارداد استقرار و افزایش فضای آزمایشگاهی',
      summary: 'شرکت پارس هوش مصنوعی پردیس با توجه به افزایش نیروی انسانی به ۲۲ نفر، درخواست تمدید قرارداد و تخصیص فضای مجاور را ارسال نموده است.',
      body: 'با سلام و احترام؛\n\nنظر به توسعه فعالیت‌های تحقیق و توسعه این شرکت و افزایش تعداد متخصصین مستقر به ۲۲ نفر، خواهشمند است با تمدید قرارداد استقرار برای سال جدید و تخصیص واحد مجاور موافقت فرمایید.',
      priority: 'فوری',
      confidentiality: 'عادی',
      status: 'ارجاع‌شده',
      deadline: '1405/01/28',
      assignedToRole: 'expert',
      assignedToName: 'مهندس حسینی (کارشناس ارزیابی و پذیرش)',
      ccList: ['واحد حقوقی و قراردادها', 'امور اداری مرکز رشد'],
      signerName: 'دکتر امیرحسین کاظمی',
      signerTitle: 'مدیرعامل',
      attachments: [
        { id: 'att-1', name: 'گزارش_عملکرد_سالانه_پارس_هوش.pdf', size: '1.4 MB', type: 'application/pdf', date: '1405/01/19' },
        { id: 'att-2', name: 'فرم_درخواست_تمدید.docx', size: '420 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', date: '1405/01/19' }
      ],
      versions: [
        { version: 1, date: '1405/01/19 09:30', user: 'سرکار خانم کریمی (مسئول دبیرخانه)', note: 'ثبت اولیه نامه وارده در دفتر اندیکاتور' }
      ],
      referrals: [
        {
          id: 'ref-1',
          fromUser: 'دکتر رضایی (رئیس مرکز رشد)',
          toRole: 'expert',
          toName: 'مهندس حسینی (کارشناس ارزیابی و پذیرش)',
          referralType: 'جهت بررسی',
          deadline: '1405/01/28',
          instructions: 'سوابق عملکرد سال گذشته و وضعیت پرداخت اجاره‌بهای شرکت بررسی و گزارش شود.',
          date: '1405/01/19 11:15',
          response: '',
          completed: false
        }
      ],
      isDraft: false,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    },
    {
      id: 'let-102',
      type: 'incoming',
      indicatorNumber: '1405/و/1002',
      year: '1405',
      seqNumber: 1002,
      senderType: 'حقوقی',
      senderName: 'معاونت توسعه فناوری پارک',
      senderOrg: 'پارک فناوری پردیس',
      originLetterNumber: '۹۰/۱۴۰۵/۴۴۱۰',
      letterDate: '1405/01/20',
      receiptDate: '1405/01/20',
      recipientName: 'مرکز رشد فناوری نخبگان',
      recipientOrg: 'مرکز رشد فناوری نخبگان',
      subject: 'اعلام سهمیه تسهیلات نمونه‌سازی و تجاری‌سازی شرکت‌های دانش‌بنیان',
      summary: 'ابلاغ دستورالعمل جدید پرداخت گرنت و تسهیلات کم‌بهره ویژه هسته‌ها و شرکت‌های مستقر در مراکز رشد.',
      body: 'با سلام و احترام؛\n\nبدین‌وسیله دستورالعمل اجرایی حمایت از نمونه‌سازی محصولات فناورانه در سال ۱۴۰۵ جهت اطلاع و معرفی شرکت‌های واجد شرایط ارسال می‌گردد.',
      priority: 'عادی',
      confidentiality: 'محرمانه',
      status: 'در انتظار پاسخ',
      deadline: '1405/02/05',
      assignedToRole: 'org_manager',
      assignedToName: 'دکتر رضایی (رئیس مرکز رشد)',
      ccList: ['دبیرخانه مرکزی'],
      signerName: 'معاون توسعه فناوری',
      signerTitle: 'پارک فناوری پردیس',
      attachments: [
        { id: 'att-3', name: 'دستورالعمل_تسهیلات_1405.pdf', size: '2.1 MB', type: 'application/pdf', date: '1405/01/20' }
      ],
      versions: [
        { version: 1, date: '1405/01/20 10:05', user: 'سرکار خانم کریمی (مسئول دبیرخانه)', note: 'ثبت نامه محرمانه وارده' }
      ],
      referrals: [
        {
          id: 'ref-2',
          fromUser: 'سرکار خانم کریمی (مسئول دبیرخانه)',
          toRole: 'org_manager',
          toName: 'دکتر رضایی (رئیس مرکز رشد)',
          referralType: 'جهت اظهارنظر',
          deadline: '1405/02/05',
          instructions: 'جهت استحضار و تعیین اولویت شرکت‌های معرفی‌شده.',
          date: '1405/01/20 10:15',
          response: '',
          completed: false
        }
      ],
      isDraft: false,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    },
    {
      id: 'let-103',
      type: 'incoming',
      indicatorNumber: '1405/و/1003',
      year: '1405',
      seqNumber: 1003,
      senderType: 'حقوقی',
      senderName: 'دکتر مریم احمدی',
      senderOrg: 'زیست‌فناوران نوین ژنوم',
      originLetterNumber: 'ژ/۱۴۰۵/۰۸',
      letterDate: '1405/01/10',
      receiptDate: '1405/01/11',
      recipientName: 'مرکز رشد فناوری نخبگان',
      recipientOrg: 'مرکز رشد فناوری نخبگان',
      subject: 'درخواست معرفی‌نامه جهت اخذ مجوز اداره کل تجهیزات پزشکی',
      summary: 'درخواست صدور معرفی‌نامه رسمی برای ارائه به سازمان غذا و دارو.',
      body: 'با سلام و احترام؛\n\nخواهشمند است گواهی اشتغال و استقرار این شرکت در مرکز رشد فناوری نخبگان جهت ارائه به اداره کل تجهیزات پزشکی صادر گردد.',
      priority: 'عادی',
      confidentiality: 'عادی',
      status: 'مختومه',
      deadline: '1405/01/15',
      assignedToRole: 'secretariat_officer',
      assignedToName: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      ccList: [],
      signerName: 'دکتر مریم احمدی',
      signerTitle: 'مدیرعامل',
      attachments: [],
      versions: [],
      referrals: [
        {
          id: 'ref-3',
          fromUser: 'دکتر رضایی (رئیس مرکز رشد)',
          toRole: 'secretariat_officer',
          toName: 'سرکار خانم کریمی (مسئول دبیرخانه)',
          referralType: 'جهت تهیه پاسخ',
          deadline: '1405/01/15',
          instructions: 'معرفی‌نامه صادر و شماره صادره ثبت گردد.',
          date: '1405/01/11 12:00',
          response: 'معرفی‌نامه به شماره 1405/ص/2001 صادر و تحویل نماینده شرکت شد.',
          completed: true
        }
      ],
      isDraft: false,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    },
    {
      id: 'let-201',
      type: 'outgoing',
      indicatorNumber: '1405/ص/2001',
      year: '1405',
      seqNumber: 2001,
      senderType: 'حقوقی',
      senderName: 'مرکز رشد فناوری نخبگان',
      senderOrg: 'پارک فناوری پردیس',
      originLetterNumber: '',
      letterDate: '1405/01/14',
      receiptDate: '1405/01/14',
      recipientName: 'اداره کل تجهیزات و ملزومات پزشکی',
      recipientOrg: 'زیست‌فناوران نوین ژنوم',
      subject: 'معرفی شرکت زیست‌فناوران نوین ژنوم جهت اخذ مجوز تولید کیت تشخیصی',
      summary: 'صدور معرفی‌نامه رسمی استقرار و فعالیت فناورانه شرکت زیست‌فناوران نوین ژنوم.',
      body: 'با سلام و احترام؛\n\nبدین‌وسیله به استحضار می‌رساند شرکت «زیست‌فناوران نوین ژنوم» به شناسه ملی ۱۴۰۰۹۸۷۶۵۴۳ از واحدهای فناور دانش‌بنیان مستقر در مرکز رشد فناوری نخبگان پارک فناوری پردیس می‌باشد.\n\nبا توجه به توانمندی‌های فنی آن شرکت در زمینه تولید کیت‌های تشخیص مولکولی، خواهشمند است مساعدت لازم در فرآیند ارزیابی و صدور مجوزهای مربوطه مبذول گردد.',
      priority: 'عادی',
      confidentiality: 'عادی',
      status: 'ارسال‌شده',
      deadline: '',
      assignedToRole: 'secretariat_officer',
      assignedToName: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      ccList: ['شرکت زیست‌فناوران نوین ژنوم', 'بایگانی پرونده شرکت'],
      signerName: 'دکتر حمیدرضا رضایی',
      signerTitle: 'رئیس مرکز رشد فناوری نخبگان',
      attachments: [],
      versions: [
        { version: 1, date: '1405/01/14 13:20', user: 'سرکار خانم کریمی (مسئول دبیرخانه)', note: 'تأیید نهایی و اختصاص شماره اندیکاتور صادره' }
      ],
      referrals: [],
      isDraft: false,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    },
    {
      id: 'let-202',
      type: 'outgoing',
      indicatorNumber: '1405/ص/2002',
      year: '1405',
      seqNumber: 2002,
      senderType: 'حقوقی',
      senderName: 'مرکز رشد فناوری نخبگان',
      senderOrg: 'پارک فناوری پردیس',
      originLetterNumber: '',
      letterDate: '1405/01/21',
      receiptDate: '1405/01/21',
      recipientName: 'مدیرعامل محترم شرکت مکاترونیک و رباتیک سپهر',
      recipientOrg: 'مکاترونیک و رباتیک سپهر',
      subject: 'ابلاغ مصوبه انتقال و استقرار در اراضی فاز ۲ پارک فناوری پردیس',
      summary: 'اعلام موافقت نهایی با فارغ‌التحصیلی شرکت از مرکز رشد و انتقال به اراضی پارک.',
      body: 'با سلام و احترام؛\n\nبا تبریک موفقیت‌های ارزشمند آن مجموعه در تجاری‌سازی ربات‌های لجستیک خودران، به اطلاع می‌رساند با درخواست انتقال و استقرار مستقل شرکت «مکاترونیک و رباتیک سپهر» در اراضی فاز ۲ پارک فناوری پردیس موافقت گردید.\n\nخواهشمند است جهت تحویل واحد فعلی در مرکز رشد و امضای صورت‌جلسه خروج موفق اقدام فرمایید.',
      priority: 'فوری',
      confidentiality: 'عادی',
      status: 'ارسال‌شده',
      deadline: '',
      assignedToRole: 'org_manager',
      assignedToName: 'دکتر رضایی (رئیس مرکز رشد)',
      ccList: ['معاونت عمرانی و بهره‌برداری پارک', 'واحد مالی مرکز رشد'],
      signerName: 'دکتر حمیدرضا رضایی',
      signerTitle: 'رئیس مرکز رشد فناوری نخبگان',
      attachments: [],
      versions: [
        { version: 1, date: '1405/01/21 15:40', user: 'دکتر رضایی (رئیس مرکز رشد)', note: 'ثبت قطعی و صدور نامه صادره' }
      ],
      referrals: [],
      isDraft: false,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    },
    {
      id: 'let-draft-1',
      type: 'outgoing',
      indicatorNumber: '',
      year: '1405',
      seqNumber: null,
      senderType: 'حقوقی',
      senderName: 'مرکز رشد فناوری نخبگان',
      senderOrg: 'پارک فناوری پردیس',
      originLetterNumber: '',
      letterDate: '1405/01/23',
      receiptDate: '1405/01/23',
      recipientName: 'صندوق پژوهش و فناوری غیر دولتی پارک پردیس',
      recipientOrg: 'هسته فناور نانوپوشش آریا',
      subject: 'معرفی هسته فناور نانوپوشش آریا جهت دریافت تسهیلات نمونه‌سازی',
      summary: 'پیش‌نویس معرفی‌نامه تسهیلات بذری برای هسته فناور آریا',
      body: 'با سلام و احترام؛\n\nبدین‌وسیله هسته فناور «نانوپوشش آریا» که در دوره پیش‌رشد مرکز رشد فناوری نخبگان مشغول به فعالیت می‌باشد، جهت بررسی طرح و بهره‌مندی از تسهیلات نمونه‌سازی معرفی می‌گردد.',
      priority: 'عادی',
      confidentiality: 'عادی',
      status: 'پیش‌نویس',
      deadline: '',
      assignedToRole: 'expert',
      assignedToName: 'مهندس حسینی (کارشناس ارزیابی و پذیرش)',
      ccList: [],
      signerName: 'دکتر حمیدرضا رضایی',
      signerTitle: 'رئیس مرکز رشد فناوری نخبگان',
      attachments: [],
      versions: [
        { version: 1, date: '1405/01/23 08:45', user: 'مهندس حسینی (کارشناس ارزیابی و پذیرش)', note: 'ذخیره پیش‌نویس اولیه' }
      ],
      referrals: [],
      isDraft: true,
      isDeleted: false,
      deletedAt: '',
      deletedBy: ''
    }
  ],
  indicatorLedger: [
    {
      id: 'ind-1',
      indicatorNumber: '1405/و/1001',
      type: 'وارده',
      year: '1405',
      seq: 1001,
      letterId: 'let-101',
      subject: 'درخواست تمدید قرارداد استقرار و افزایش فضای آزمایشگاهی',
      party: 'پارس هوش مصنوعی پردیس',
      registeredAt: '1405/01/19 09:30',
      registeredBy: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      isLetterDeleted: false
    },
    {
      id: 'ind-2',
      indicatorNumber: '1405/و/1002',
      type: 'وارده',
      year: '1405',
      seq: 1002,
      letterId: 'let-102',
      subject: 'اعلام سهمیه تسهیلات نمونه‌سازی و تجاری‌سازی شرکت‌های دانش‌بنیان',
      party: 'پارک فناوری پردیس',
      registeredAt: '1405/01/20 10:05',
      registeredBy: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      isLetterDeleted: false
    },
    {
      id: 'ind-3',
      indicatorNumber: '1405/و/1003',
      type: 'وارده',
      year: '1405',
      seq: 1003,
      letterId: 'let-103',
      subject: 'درخواست معرفی‌نامه جهت اخذ مجوز اداره کل تجهیزات پزشکی',
      party: 'زیست‌فناوران نوین ژنوم',
      registeredAt: '1405/01/11 08:50',
      registeredBy: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      isLetterDeleted: false
    },
    {
      id: 'ind-4',
      indicatorNumber: '1405/ص/2001',
      type: 'صادره',
      year: '1405',
      seq: 2001,
      letterId: 'let-201',
      subject: 'معرفی شرکت زیست‌فناوران نوین ژنوم جهت اخذ مجوز تولید کیت تشخیصی',
      party: 'اداره کل تجهیزات و ملزومات پزشکی',
      registeredAt: '1405/01/14 13:20',
      registeredBy: 'سرکار خانم کریمی (مسئول دبیرخانه)',
      isLetterDeleted: false
    },
    {
      id: 'ind-5',
      indicatorNumber: '1405/ص/2002',
      type: 'صادره',
      year: '1405',
      seq: 2002,
      letterId: 'let-202',
      subject: 'ابلاغ مصوبه انتقال و استقرار در اراضی فاز ۲ پارک فناوری پردیس',
      party: 'مکاترونیک و رباتیک سپهر',
      registeredAt: '1405/01/21 15:40',
      registeredBy: 'دکتر رضایی (رئیس مرکز رشد)',
      isLetterDeleted: false
    }
  ],
  auditLogs: [
    { id: 'log-1', date: '1405/01/21 15:40', user: 'دکتر رضایی (رئیس مرکز رشد)', action: 'ثبت قطعی نامه صادره 1405/ص/2002' },
    { id: 'log-2', date: '1405/01/20 10:15', user: 'سرکار خانم کریمی (مسئول دبیرخانه)', action: 'ارجاع نامه وارده 1405/و/1002 به رئیس مرکز رشد' },
    { id: 'log-3', date: '1405/01/19 11:15', user: 'دکتر رضایی (رئیس مرکز رشد)', action: 'ارجاع نامه وارده 1405/و/1001 به کارشناس ارزیابی' }
  ]
};

// ============================================================================
// ۳. توابع کمکی تاریخ شمسی، اعداد فارسی و تولید فایل واقعی Word (.docx)
// ============================================================================
const toPersianDigits = (val) => {
  if (val === null || val === undefined) return '';
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(val).replace(/\d/g, (x) => persianDigits[x]);
};

const getTodayJalali = () => {
  try {
    const parts = new Intl.DateTimeFormat('fa-IR-u-nu-latn', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).formatToParts(new Date());
    const y = parts.find((p) => p.type === 'year')?.value || '1405';
    const m = parts.find((p) => p.type === 'month')?.value || '01';
    const d = parts.find((p) => p.type === 'day')?.value || '23';
    return `${y}/${m}/${d}`;
  } catch {
    return '1405/01/23';
  }
};

const getNowJalaliDateTime = () => {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  return `${getTodayJalali()} ${hh}:${mm}`;
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

// تولید فایل استاندارد OpenXML (.docx)
const makeCrc32Table = () => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
};
const CRC32_TABLE = makeCrc32Table();

const computeCrc32 = (bytes) => {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    crc = CRC32_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
};

const buildSimpleZipBlob = (files) => {
  const encoder = new TextEncoder();
  const localChunks = [];
  const centralChunks = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encoder.encode(file.name);
    const contentBytes = typeof file.content === 'string' ? encoder.encode(file.content) : file.content;
    const crc = computeCrc32(contentBytes);
    const size = contentBytes.length;

    const localHeader = new Uint8Array(30 + nameBytes.length);
    const lv = new DataView(localHeader.buffer);
    lv.setUint32(0, 0x04034b50, true);
    lv.setUint16(4, 20, true);
    lv.setUint16(6, 0x0800, true);
    lv.setUint16(8, 0, true);
    lv.setUint16(10, 0, true);
    lv.setUint16(12, 0, true);
    lv.setUint32(14, crc, true);
    lv.setUint32(18, size, true);
    lv.setUint32(22, size, true);
    lv.setUint16(26, nameBytes.length, true);
    lv.setUint16(28, 0, true);
    localHeader.set(nameBytes, 30);

    localChunks.push(localHeader, contentBytes);

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
    cv.setUint32(20, size, true);
    cv.setUint32(24, size, true);
    cv.setUint16(28, nameBytes.length, true);
    cv.setUint16(30, 0, true);
    cv.setUint16(32, 0, true);
    cv.setUint16(34, 0, true);
    cv.setUint16(36, 0, true);
    cv.setUint32(38, 0, true);
    cv.setUint32(42, offset, true);
    centralHeader.set(nameBytes, 46);

    centralChunks.push(centralHeader);
    offset += localHeader.length + contentBytes.length;
  });

  const centralSize = centralChunks.reduce((acc, c) => acc + c.length, 0);
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

  return new Blob([...localChunks, ...centralChunks, endRecord], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  });
};

const escapeXml = (str) =>
  String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

const exportLetterToDocx = (letter, orgSettings) => {
  const letterNum = toPersianDigits(letter.indicatorNumber || 'پیش‌نویس (بدون شماره)');
  const letterDate = toPersianDigits(letter.letterDate || getTodayJalali());
  const attCount = letter.attachments?.length ? `${toPersianDigits(letter.attachments.length)} فقره` : 'ندارد';
  const recipientLine = `${letter.recipientName || ''} ${letter.recipientOrg ? `(${letter.recipientOrg})` : ''}`.trim();
  const bodyParagraphs = String(letter.body || '')
    .split('\n')
    .map(
      (line) => `
      <w:p>
        <w:pPr>
          <w:bidi/>
          <w:jc w:val="both"/>
          <w:spacing w:after="160" w:line="360" w:lineRule="auto"/>
        </w:pPr>
        <w:r>
          <w:rPr>
            <w:rFonts w:ascii="B Nazanin" w:hAnsi="B Nazanin" w:cs="B Nazanin"/>
            <w:rtl/>
            <w:sz w:val="28"/>
            <w:szCs w:val="28"/>
          </w:rPr>
          <w:t xml:space="preserve">${escapeXml(line)}</w:t>
        </w:r>
      </w:p>`
    )
    .join('');

  const ccXml =
    letter.ccList && letter.ccList.length > 0
      ? `
      <w:p>
        <w:pPr><w:bidi/><w:spacing w:before="240" w:after="80"/></w:pPr>
        <w:r>
          <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
          <w:t>رونوشت:</w:t>
        </w:r>
      </w:p>
      ${letter.ccList
        .map(
          (cc) => `
        <w:p>
          <w:pPr><w:bidi/><w:spacing w:after="60"/></w:pPr>
          <w:r>
            <w:rPr><w:rtl/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
            <w:t>• ${escapeXml(cc)}</w:t>
          </w:r>
        </w:p>`
        )
        .join('')}`
      : '';

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="center"/><w:spacing w:after="60"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
        <w:t>بسمه تعالی</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="center"/><w:spacing w:after="40"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:color w:val="0F294A"/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
        <w:t>${escapeXml(orgSettings?.orgHeaderTitle || 'معاونت علمی، فناوری و اقتصاد دانش‌بنیان ریاست جمهوری')}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="center"/><w:spacing w:after="200"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:color w:val="1D4ED8"/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
        <w:t>${escapeXml(orgSettings?.orgSubTitle || 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان')}</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="left"/><w:spacing w:after="60"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
        <w:t>شماره نامه: ${escapeXml(letterNum)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="left"/><w:spacing w:after="60"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
        <w:t>تاریخ: ${escapeXml(letterDate)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="left"/><w:spacing w:after="240"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="22"/><w:szCs w:val="22"/></w:rPr>
        <w:t>پیوست: ${escapeXml(attCount)}</w:t>
      </w:r>
    </w:p>

    <w:p>
      <w:pPr><w:bidi/><w:spacing w:after="120"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
        <w:t>گیرنده محترم: ${escapeXml(recipientLine)}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:spacing w:after="240"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
        <w:t>موضوع: ${escapeXml(letter.subject || '')}</w:t>
      </w:r>
    </w:p>

    ${bodyParagraphs}

    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="left"/><w:spacing w:before="320" w:after="60"/></w:pPr>
      <w:r>
        <w:rPr><w:b/><w:bCs/><w:rtl/><w:sz w:val="26"/><w:szCs w:val="26"/></w:rPr>
        <w:t>${escapeXml(letter.signerName || 'دکتر حمیدرضا رضایی')}</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:bidi/><w:jc w:val="left"/><w:spacing w:after="240"/></w:pPr>
      <w:r>
        <w:rPr><w:rtl/><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
        <w:t>${escapeXml(letter.signerTitle || 'رئیس مرکز رشد فناوری نخبگان')}</w:t>
      </w:r>
    </w:p>

    ${ccXml}

    <w:sectPr>
      <w:bidi/>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const blob = buildSimpleZipBlob([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: relsXml },
    { name: 'word/document.xml', content: documentXml }
  ]);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const safeFileName = (letter.indicatorNumber || letter.subject || 'Official-Letter').replace(/[\\/:*?"<>|]/g, '-');
  a.download = `${safeFileName}.docx`;
  a.click();
  URL.revokeObjectURL(url);
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

  const initials =
    (company.name || 'ش')
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
  useEffect(() => {
    if (!window.XLSX && !document.getElementById('sheetjs-cdn-script')) {
      const script = document.createElement('script');
      script.id = 'sheetjs-cdn-script';
      script.src = 'https://cdn.sheetjs.com/xlsx-0.20.2/package/dist/xlsx.full.min.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('nokhbegan_secretariat_v1', JSON.stringify(secretariat));
    } catch (e) {
      console.error('Secretariat storage error', e);
    }
  }, [secretariat]);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState({ portal: true, secretariat: true });

  const [activeSection, setActiveSection] = useState('public_home');
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);

  const [adminUser, setAdminUser] = useState({
    username: 'admin',
    role: 'admin',
    secretariatRole: 'system_admin',
    name: 'مهندس محمدی (مدیر سیستم)'
  });

  const [selectedLetterId, setSelectedLetterId] = useState(null);
  const [editingDraftLetter, setEditingDraftLetter] = useState(null);

  const [globalSearch, setGlobalSearch] = useState('');
  const [showGlobalSearchResults, setShowGlobalSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const companyStats = useMemo(() => {
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
        (c.membershipStatus &&
          (c.membershipStatus.includes('آماده خروج') || c.membershipStatus.includes('رو به اتمام'))) ||
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

  const visibleLetters = useMemo(() => {
    const roleObj = SECRETARIAT_ROLES.find((r) => r.id === adminUser?.secretariatRole) || SECRETARIAT_ROLES[4];
    return secretariat.letters.filter((l) => {
      if (l.confidentiality === 'خیلی محرمانه' && roleObj.level < 4) return false;
      if (l.confidentiality === 'محرمانه' && roleObj.level < 2) return false;
      if (roleObj.id === 'expert') {
        const isAssigned =
          l.assignedToRole === 'expert' ||
          (l.referrals || []).some((r) => r.toRole === 'expert');
        return isAssigned || l.confidentiality === 'عادی';
      }
      return true;
    });
  }, [secretariat.letters, adminUser]);

  const secretariatStats = useMemo(() => {
    const activeLetters = visibleLetters.filter((l) => !l.isDeleted);
    const incoming = activeLetters.filter((l) => l.type === 'incoming' && !l.isDraft);
    const outgoing = activeLetters.filter((l) => l.type === 'outgoing' && !l.isDraft);
    const pendingAction = activeLetters.filter(
      (l) => !l.isDraft && ['ثبت اولیه', 'در انتظار ارجاع', 'ارجاع‌شده', 'در حال بررسی', 'در انتظار پاسخ'].includes(l.status)
    );
    const referred = activeLetters.filter((l) => !l.isDraft && (l.referrals?.length || 0) > 0);
    const withDeadline = activeLetters.filter((l) => !l.isDraft && l.deadline && l.status !== 'مختومه' && l.status !== 'بایگانی‌شده');
    const archived = activeLetters.filter((l) => l.status === 'مختومه' || l.status === 'بایگانی‌شده');
    const drafts = activeLetters.filter((l) => l.isDraft);
    const myTasks = activeLetters.filter(
      (l) =>
        !l.isDraft &&
        l.status !== 'مختومه' &&
        l.status !== 'بایگانی‌شده' &&
        (l.assignedToRole === adminUser?.secretariatRole ||
          (l.referrals || []).some((r) => r.toRole === adminUser?.secretariatRole && !r.completed))
    );

    return {
      incomingCount: incoming.length,
      outgoingCount: outgoing.length,
      pendingCount: pendingAction.length,
      referredCount: referred.length,
      deadlineCount: withDeadline.length,
      archivedCount: archived.length,
      draftsCount: drafts.length,
      myTasksCount: myTasks.length,
      myTasksList: myTasks,
      deadlineList: withDeadline
    };
  }, [visibleLetters, adminUser]);

  const globalSearchResults = useMemo(() => {
    const q = globalSearch.trim().toLowerCase();
    if (!q) return { companies: [], letters: [] };
    const matchedCompanies = companies
      .filter(
        (c) =>
          (c.name && c.name.toLowerCase().includes(q)) ||
          (c.field && c.field.toLowerCase().includes(q)) ||
          (c.nationalId && c.nationalId.includes(q))
      )
      .slice(0, 5);
    const matchedLetters = visibleLetters
      .filter(
        (l) =>
          !l.isDeleted &&
          ((l.subject && l.subject.toLowerCase().includes(q)) ||
            (l.indicatorNumber && l.indicatorNumber.toLowerCase().includes(q)) ||
            (l.senderOrg && l.senderOrg.toLowerCase().includes(q)) ||
            (l.recipientOrg && l.recipientOrg.toLowerCase().includes(q)))
      )
      .slice(0, 5);
    return { companies: matchedCompanies, letters: matchedLetters };
  }, [globalSearch, companies, visibleLetters]);

  const allocateIndicatorNumber = (type, currentSettings) => {
    const year = currentSettings.currentYear || '1405';
    if (type === 'incoming') {
      const seq = currentSettings.nextIncomingSeq;
      const num = (currentSettings.incomingPattern || '{YEAR}/و/{SEQ}')
        .replace('{YEAR}', year)
        .replace('{SEQ}', String(seq));
      return { indicatorNumber: num, seq, nextIncomingSeq: seq + 1 };
    }
    if (type === 'outgoing') {
      const seq = currentSettings.nextOutgoingSeq;
      const num = (currentSettings.outgoingPattern || '{YEAR}/ص/{SEQ}')
        .replace('{YEAR}', year)
        .replace('{SEQ}', String(seq));
      return { indicatorNumber: num, seq, nextOutgoingSeq: seq + 1 };
    }
    const seq = currentSettings.nextInternalSeq;
    const num = (currentSettings.internalPattern || '{YEAR}/د/{SEQ}')
      .replace('{YEAR}', year)
      .replace('{SEQ}', String(seq));
    return { indicatorNumber: num, seq, nextInternalSeq: seq + 1 };
  };

  const handleSaveLetter = (letterPayload, finalize = true) => {
    setSecretariat((prev) => {
      let nextSettings = { ...prev.settings };
      let nextLedger = [...prev.indicatorLedger];
      let nextLetters = [...prev.letters];
      const existingIdx = nextLetters.findIndex((l) => l.id === letterPayload.id);
      const nowStr = getNowJalaliDateTime();

      let finalIndicator = letterPayload.indicatorNumber || '';
      let seqNum = letterPayload.seqNumber || null;

      const needsIndicator =
        !finalIndicator && (letterPayload.type === 'incoming' || finalize);

      if (needsIndicator) {
        const alloc = allocateIndicatorNumber(letterPayload.type, nextSettings);
        finalIndicator = alloc.indicatorNumber;
        seqNum = alloc.seq;
        if (letterPayload.type === 'incoming') nextSettings.nextIncomingSeq = alloc.nextIncomingSeq;
        else if (letterPayload.type === 'outgoing') nextSettings.nextOutgoingSeq = alloc.nextOutgoingSeq;
        else nextSettings.nextInternalSeq = alloc.nextInternalSeq;
      }

      const savedLetter = {
        ...letterPayload,
        id: letterPayload.id || 'let-' + Date.now(),
        indicatorNumber: finalIndicator,
        year: nextSettings.currentYear,
        seqNumber: seqNum,
        isDraft: !finalize,
        status: !finalize
          ? 'پیش‌نویس'
          : letterPayload.type === 'incoming'
          ? letterPayload.status || 'ثبت اولیه'
          : 'ارسال‌شده',
        versions: [
          {
            version: (letterPayload.versions?.length || 0) + 1,
            date: nowStr,
            user: adminUser?.name || 'کاربر',
            note: !finalize
              ? 'ذخیره در پیش‌نویس‌ها'
              : `ثبت نهایی با شماره اندیکاتور ${finalIndicator}`
          },
          ...(letterPayload.versions || [])
        ]
      };

      if (existingIdx !== -1) {
        nextLetters[existingIdx] = savedLetter;
      } else {
        nextLetters.unshift(savedLetter);
      }

      if (finalIndicator && !nextLedger.some((item) => item.indicatorNumber === finalIndicator)) {
        nextLedger.unshift({
          id: 'ind-' + Date.now(),
          indicatorNumber: finalIndicator,
          type:
            letterPayload.type === 'incoming'
              ? 'وارده'
              : letterPayload.type === 'outgoing'
              ? 'صادره'
              : 'داخلی',
          year: nextSettings.currentYear,
          seq: seqNum,
          letterId: savedLetter.id,
          subject: savedLetter.subject,
          party:
            letterPayload.type === 'incoming'
              ? savedLetter.senderOrg || savedLetter.senderName
              : savedLetter.recipientOrg || savedLetter.recipientName,
          registeredAt: nowStr,
          registeredBy: adminUser?.name || 'مسئول دبیرخانه',
          isLetterDeleted: false
        });
      }

      const actionDesc = !finalize
        ? `ذخیره پیش‌نویس نامه: «${savedLetter.subject}»`
        : `ثبت قطعی نامه (${finalIndicator}): «${savedLetter.subject}»`;

      return {
        ...prev,
        settings: nextSettings,
        letters: nextLetters,
        indicatorLedger: nextLedger,
        auditLogs: [
          { id: 'log-' + Date.now(), date: nowStr, user: adminUser?.name || 'کاربر', action: actionDesc },
          ...prev.auditLogs
        ]
      };
    });

    showToast(
      finalize
        ? 'نامه با موفقیت ثبت نهایی شد و شماره اندیکاتور اختصاص یافت.'
        : 'نامه در بخش پیش‌نویس‌ها ذخیره شد.'
    );
  };

  const handleReferLetter = (letterId, referralData) => {
    const nowStr = getNowJalaliDateTime();
    setSecretariat((prev) => {
      const nextLetters = prev.letters.map((l) => {
        if (l.id !== letterId) return l;
        const newRefs = referralData.targets.map((target, i) => ({
          id: 'ref-' + Date.now() + '-' + i,
          fromUser: adminUser?.name || 'مدیر',
          toRole: target.roleId,
          toName: target.label,
          referralType: referralData.referralType,
          deadline: referralData.deadline,
          instructions: referralData.instructions,
          date: nowStr,
          response: '',
          completed: false
        }));
        const primaryTarget = referralData.targets[0];
        return {
          ...l,
          status: 'ارجاع‌شده',
          deadline: referralData.deadline || l.deadline,
          assignedToRole: primaryTarget?.roleId || l.assignedToRole,
          assignedToName: primaryTarget?.label || l.assignedToName,
          referrals: [...newRefs, ...(l.referrals || [])]
        };
      });

      return {
        ...prev,
        letters: nextLetters,
        auditLogs: [
          {
            id: 'log-' + Date.now(),
            date: nowStr,
            user: adminUser?.name || 'کاربر',
            action: `ارجاع نامه به ${referralData.targets.map((t) => t.label).join('، ')}`
          },
          ...prev.auditLogs
        ]
      };
    });
    showToast('ارجاع نامه با موفقیت ثبت و در کارتابل گیرندگان قرار گرفت.');
  };

  const handleSoftDeleteLetter = (letter) => {
    const nowStr = getNowJalaliDateTime();
    setSecretariat((prev) => ({
      ...prev,
      letters: prev.letters.map((l) =>
        l.id === letter.id
          ? { ...l, isDeleted: true, deletedAt: nowStr, deletedBy: adminUser?.name || 'کاربر' }
          : l
      ),
      indicatorLedger: prev.indicatorLedger.map((ind) =>
        ind.letterId === letter.id ? { ...ind, isLetterDeleted: true } : ind
      ),
      auditLogs: [
        {
          id: 'log-' + Date.now(),
          date: nowStr,
          user: adminUser?.name || 'کاربر',
          action: `انتقال نامه ${letter.indicatorNumber || letter.subject} به حذف‌شده‌ها (حفظ شماره اندیکاتور)`
        },
        ...prev.auditLogs
      ]
    }));
    showToast('نامه به بخش حذف‌شده‌ها منتقل شد (شماره اندیکاتور محفوظ ماند).');
  };

  const handleRestoreLetter = (letter) => {
    const nowStr = getNowJalaliDateTime();
    setSecretariat((prev) => ({
      ...prev,
      letters: prev.letters.map((l) =>
        l.id === letter.id ? { ...l, isDeleted: false, deletedAt: '', deletedBy: '' } : l
      ),
      indicatorLedger: prev.indicatorLedger.map((ind) =>
        ind.letterId === letter.id ? { ...ind, isLetterDeleted: false } : ind
      ),
      auditLogs: [
        {
          id: 'log-' + Date.now(),
          date: nowStr,
          user: adminUser?.name || 'کاربر',
          action: `بازیابی نامه ${letter.indicatorNumber || letter.subject} از حذف‌شده‌ها`
        },
        ...prev.auditLogs
      ]
    }));
    showToast('نامه با موفقیت بازیابی شد.');
  };

  const handlePermanentDeleteLetter = (letter) => {
    if (adminUser?.secretariatRole !== 'system_admin') {
      showToast('فقط «مدیر سیستم» مجوز حذف دائمی نامه‌ها را دارد.', 'error');
      return;
    }
    if (!window.confirm('آیا از حذف دائمی این نامه اطمینان دارید؟ سابقه شماره اندیکاتور همچنان در دفتر اندیکاتور باقی می‌ماند.')) {
      return;
    }
    setSecretariat((prev) => ({
      ...prev,
      letters: prev.letters.filter((l) => l.id !== letter.id),
      auditLogs: [
        {
          id: 'log-' + Date.now(),
          date: getNowJalaliDateTime(),
          user: adminUser?.name || 'مدیر سیستم',
          action: `حذف دائمی نامه ${letter.indicatorNumber || letter.subject}`
        },
        ...prev.auditLogs
      ]
    }));
    showToast('نامه به‌صورت دائمی حذف شد.');
  };

  const handleNavigate = (sectionId) => {
    setActiveSection(sectionId);
    setMobileDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openCompanyDetail = (company) => {
    setSelectedCompanyId(company.id);
    setActiveSection('company_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sidebarGroups = [
    {
      id: 'portal',
      title: 'پورتال عمومی و شرکت‌ها',
      icon: Globe,
      items: [
        { id: 'public_home', label: 'دایرکتوری عمومی شرکت‌ها', icon: Building2 },
        { id: 'comp_dashboard', label: 'داشبورد آماری شرکت‌ها', icon: BarChart3 },
        { id: 'comp_list', label: 'مدیریت شرکت‌ها', icon: Layers, badge: companies.length },
        { id: 'comp_form', label: 'ثبت دستی شرکت جدید', icon: Plus },
        { id: 'comp_excel', label: 'بارگذاری گروهی اکسل', icon: FileSpreadsheet },
        { id: 'comp_settings', label: 'سطوح دسترسی و پشتیبان', icon: Shield }
      ]
    },
    {
      id: 'secretariat',
      title: 'دبیرخانه الکترونیکی',
      icon: Mail,
      items: [
        { id: 'sec_dashboard', label: 'داشبورد دبیرخانه', icon: BarChart3 },
        { id: 'sec_incoming', label: 'نامه‌های وارده', icon: Inbox, badge: secretariatStats.incomingCount },
        { id: 'sec_outgoing', label: 'نامه‌های صادره', icon: Send, badge: secretariatStats.outgoingCount },
        { id: 'sec_new', label: 'ثبت نامه جدید', icon: FilePlus2 },
        { id: 'sec_my_tasks', label: 'کارهای ارجاع‌شده به من', icon: UserCheck, badge: secretariatStats.myTasksCount, highlight: true },
        { id: 'sec_workflow', label: 'گردش مکاتبات', icon: GitBranch },
        { id: 'sec_drafts', label: 'پیش‌نویس‌ها', icon: FileEdit, badge: secretariatStats.draftsCount },
        { id: 'sec_indicator', label: 'دفتر اندیکاتور', icon: BookOpen },
        { id: 'sec_archive', label: 'بایگانی', icon: Archive },
        { id: 'sec_trash', label: 'حذف‌شده‌ها', icon: Trash2 },
        { id: 'sec_templates', label: 'قالب‌های نامه', icon: FileCode },
        { id: 'sec_reports', label: 'گزارش‌ها', icon: FileSpreadsheet },
        { id: 'sec_settings', label: 'تنظیمات دبیرخانه', icon: Settings }
      ]
    }
  ];

  const renderSidebarContent = (isMobile = false) => {
    const expanded = isMobile ? true : sidebarOpen;
    return (
      <div className="flex flex-col h-full bg-[#0b1f3a] text-slate-200 select-none">
        <div className="h-20 px-4 flex items-center justify-between border-b border-blue-900/60 shrink-0">
          <div
            onClick={() => handleNavigate('public_home')}
            className="flex items-center gap-3 cursor-pointer overflow-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center shadow-md shrink-0">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            {expanded && (
              <div className="min-w-0">
                <span className="text-[11px] font-semibold text-sky-300 block truncate">
                  پارک فناوری پردیس
                </span>
                <span className="text-xs font-extrabold text-white block truncate">
                  مرکز رشد فناوری نخبگان
                </span>
              </div>
            )}
          </div>

          {!isMobile && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              title={sidebarOpen ? 'بستن منو' : 'باز کردن منو'}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {sidebarOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
            </button>
          )}
          {isMobile && (
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-2.5 space-y-5">
          {sidebarGroups.map((group) => {
            const isGroupOpen = openMenus[group.id];
            return (
              <div key={group.id}>
                {expanded ? (
                  <button
                    onClick={() => setOpenMenus((prev) => ({ ...prev, [group.id]: !prev[group.id] }))}
                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-sky-300/90 hover:text-white transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <group.icon className="w-4 h-4 text-sky-400" />
                      <span>{group.title}</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${isGroupOpen ? 'rotate-0' : 'rotate-90'}`}
                    />
                  </button>
                ) : (
                  <div className="border-t border-blue-900/50 my-2 mx-2" />
                )}

                {(isGroupOpen || !expanded) && (
                  <div className="mt-1 space-y-1">
                    {group.items.map((item) => {
                      const isActive = activeSection === item.id;
                      const IconComp = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            if (item.id === 'comp_form') setEditingCompany(null);
                            if (item.id === 'sec_new') setEditingDraftLetter(null);
                            handleNavigate(item.id);
                          }}
                          title={!expanded ? item.label : undefined}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative group ${
                            isActive
                              ? 'bg-gradient-to-l from-blue-600 to-blue-700 text-white font-bold shadow-md shadow-blue-950/50'
                              : 'text-slate-300 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {isActive && (
                            <span className="absolute right-0 top-2 bottom-2 w-1 bg-sky-300 rounded-l-full" />
                          )}
                          <div className="flex items-center gap-3 min-w-0">
                            <IconComp
                              className={`w-4 h-4 shrink-0 ${
                                isActive ? 'text-sky-200' : 'text-slate-400 group-hover:text-sky-300'
                              }`}
                            />
                            {expanded && <span className="truncate">{item.label}</span>}
                          </div>

                          {expanded && item.badge !== undefined && item.badge > 0 && (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                                item.highlight
                                  ? 'bg-amber-400 text-slate-950'
                                  : isActive
                                  ? 'bg-white/20 text-white'
                                  : 'bg-slate-800 text-slate-300'
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

        <div className="p-3 border-t border-blue-900/60 bg-[#081629] shrink-0">
          {expanded ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>نقش فعال در سامانه:</span>
                <span className="text-emerald-400 font-semibold">آنلاین</span>
              </div>
              <select
                value={adminUser?.secretariatRole || 'system_admin'}
                onChange={(e) => {
                  const chosen = SECRETARIAT_ROLES.find((r) => r.id === e.target.value);
                  if (chosen) {
                    setAdminUser({
                      username: chosen.id,
                      role: chosen.id === 'system_admin' || chosen.id === 'org_manager' ? 'admin' : 'expert',
                      secretariatRole: chosen.id,
                      name: chosen.userDisplayName
                    });
                    showToast(`نقش کاربری به «${chosen.label}» تغییر یافت.`);
                  }
                }}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:border-sky-400"
              >
                {SECRETARIAT_ROLES.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.userDisplayName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <button
              onClick={() => setSidebarOpen(true)}
              title={adminUser?.name}
              className="w-full flex justify-center p-2 rounded-lg bg-slate-800 text-sky-300 hover:bg-slate-700"
            >
              <UserCheck className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const selectedLetter = useMemo(
    () => secretariat.letters.find((l) => l.id === selectedLetterId) || null,
    [secretariat.letters, selectedLetterId]
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-50 text-slate-800 flex font-sans selection:bg-blue-700 selection:text-white"
    >
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

      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 border-l border-slate-200 no-print ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="sticky top-0 h-screen">{renderSidebarContent(false)}</div>
      </aside>

      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex no-print">
          <div className="w-72 h-full shadow-2xl">{renderSidebarContent(true)}</div>
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="flex-1 bg-slate-950/60 backdrop-blur-xs"
          />
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 h-16 px-4 sm:px-6 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileDrawerOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:block">
              <h2 className="text-sm font-extrabold text-[#0f294a]">
                سامانه یکپارچه مرکز رشد فناوری نخبگان و دبیرخانه الکترونیکی
              </h2>
              <p className="text-[11px] text-slate-500">
                پارک فناوری پردیس — تاریخ امروز: {toPersianDigits(getTodayJalali())}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-1 max-w-xl justify-end">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onFocus={() => setShowGlobalSearchResults(true)}
                onBlur={() => setTimeout(() => setShowGlobalSearchResults(false), 200)}
                onChange={(e) => {
                  setGlobalSearch(e.target.value);
                  setShowGlobalSearchResults(true);
                }}
                placeholder="جست‌وجوی سریع شرکت‌ها، شماره اندیکاتور یا موضوع نامه..."
                className="w-full pr-9 pl-3 py-2 rounded-xl bg-slate-100 border border-transparent focus:bg-white focus:border-blue-500 text-xs outline-none transition-all"
              />

              {showGlobalSearchResults && globalSearch.trim() && (
                <div className="absolute left-0 right-0 top-11 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 text-xs space-y-3">
                  <div>
                    <div className="font-bold text-slate-400 px-2 mb-1">
                      شرکت‌ها ({toPersianDigits(globalSearchResults.companies.length)})
                    </div>
                    {globalSearchResults.companies.length === 0 ? (
                      <p className="text-slate-400 px-2">موردی یافت نشد</p>
                    ) : (
                      globalSearchResults.companies.map((c) => (
                        <button
                          key={c.id}
                          onMouseDown={() => openCompanyDetail(c)}
                          className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-between"
                        >
                          <span className="font-bold text-slate-800">{c.name}</span>
                          <span className="text-[11px] text-slate-500">{c.field}</span>
                        </button>
                      ))
                    )}
                  </div>
                  <div className="border-t border-slate-100 pt-2">
                    <div className="font-bold text-slate-400 px-2 mb-1">
                      نامه‌های دبیرخانه ({toPersianDigits(globalSearchResults.letters.length)})
                    </div>
                    {globalSearchResults.letters.length === 0 ? (
                      <p className="text-slate-400 px-2">موردی یافت نشد</p>
                    ) : (
                      globalSearchResults.letters.map((l) => (
                        <button
                          key={l.id}
                          onMouseDown={() => setSelectedLetterId(l.id)}
                          className="w-full text-right px-2.5 py-1.5 rounded-lg hover:bg-blue-50 flex items-center justify-between gap-2"
                        >
                          <span className="font-bold text-slate-800 truncate">{l.subject}</span>
                          <span className="text-[11px] font-mono text-blue-700 shrink-0">
                            {toPersianDigits(l.indicatorNumber || 'پیش‌نویس')}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 relative transition-colors"
                title="اعلان‌های کارتابل و مهلت‌ها"
              >
                <Bell className="w-4 h-4" />
                {secretariatStats.myTasksCount > 0 && (
                  <span className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                    {toPersianDigits(secretariatStats.myTasksCount)}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-xs">
                  <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-100">
                    <span className="font-bold text-slate-900">اعلان‌های کارتابل دبیرخانه</span>
                    <button onClick={() => setShowNotifications(false)} className="text-slate-400">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {secretariatStats.myTasksList.length === 0 ? (
                    <p className="text-slate-500 py-4 text-center">اعلان جدیدی در کارتابل شما وجود ندارد.</p>
                  ) : (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {secretariatStats.myTasksList.map((task) => (
                        <div
                          key={task.id}
                          onClick={() => {
                            setSelectedLetterId(task.id);
                            setShowNotifications(false);
                          }}
                          className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 cursor-pointer hover:bg-amber-100/70"
                        >
                          <div className="flex justify-between font-bold text-amber-950 mb-0.5">
                            <span>{toPersianDigits(task.indicatorNumber)}</span>
                            {task.deadline && <span>مهلت: {toPersianDigits(task.deadline)}</span>}
                          </div>
                          <p className="text-slate-800 line-clamp-1">{task.subject}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1">
          {activeSection === 'public_home' && (
            <PublicDirectoryView
              companies={companies}
              stats={companyStats}
              onSelectCompany={openCompanyDetail}
            />
          )}

          {activeSection === 'company_detail' && (
            <CompanyProfileView
              company={companies.find((c) => c.id === selectedCompanyId)}
              accessPolicies={accessPolicies}
              isAdmin={adminUser?.role === 'admin'}
              onBack={() => handleNavigate('public_home')}
              onEdit={(comp) => {
                setEditingCompany(comp);
                handleNavigate('comp_form');
              }}
            />
          )}

          {activeSection === 'comp_dashboard' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminDashboardTab
                stats={companyStats}
                onNavigateTab={(tab) => {
                  const map = { excel: 'comp_excel', form: 'comp_form' };
                  handleNavigate(map[tab] || 'comp_list');
                }}
                onEditCompany={(c) => {
                  setEditingCompany(c);
                  handleNavigate('comp_form');
                }}
              />
            </div>
          )}

          {activeSection === 'comp_list' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminCompaniesListTab
                companies={companies}
                setCompanies={setCompanies}
                isSuperAdmin={adminUser?.role === 'admin'}
                onEdit={(c) => {
                  setEditingCompany(c);
                  handleNavigate('comp_form');
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
                setCompanies={setCompanies}
                onDone={() => handleNavigate('comp_list')}
                showToast={showToast}
              />
            </div>
          )}

          {activeSection === 'comp_settings' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <AdminSettingsTab
                setCompanies={setCompanies}
                isSuperAdmin={adminUser?.role === 'admin'}
                onBackupJson={() => {
                  const blob = new Blob([JSON.stringify(companies, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `nokhbegan-companies-${getTodayJalali().replace(/\//g, '-')}.json`;
                  a.click();
                  showToast('فایل پشتیبان شرکت‌ها ذخیره شد.');
                }}
                onExportExcel={() => {
                  if (!window.XLSX) {
                    showToast('کتابخانه اکسل در حال بارگذاری است، لطفاً چند ثانیه صبر کنید.', 'error');
                    return;
                  }
                  const ws = window.XLSX.utils.json_to_sheet(companies);
                  const wb = window.XLSX.utils.book_new();
                  window.XLSX.utils.book_append_sheet(wb, ws, 'شرکت‌ها');
                  window.XLSX.writeFile(wb, 'Nokhbegan_Companies.xlsx');
                  showToast('فایل اکسل شرکت‌ها دانلود شد.');
                }}
                showToast={showToast}
              />
            </div>
          )}

          {activeSection === 'sec_dashboard' && (
            <SecretariatDashboardView
              stats={secretariatStats}
              letters={visibleLetters}
              auditLogs={secretariat.auditLogs}
              onNavigate={handleNavigate}
              onOpenLetter={(id) => setSelectedLetterId(id)}
            />
          )}

          {activeSection === 'sec_incoming' && (
            <SecretariatLettersListView
              mode="incoming"
              title="مدیریت نامه‌های وارده"
              letters={visibleLetters.filter((l) => l.type === 'incoming' && !l.isDraft && !l.isDeleted)}
              onNewLetter={() => {
                setEditingDraftLetter({ defaultType: 'incoming' });
                handleNavigate('sec_new');
              }}
              onOpenLetter={(id) => setSelectedLetterId(id)}
              onExportWord={(l) => exportLetterToDocx(l, secretariat.settings)}
              onDelete={handleSoftDeleteLetter}
            />
          )}

          {activeSection === 'sec_outgoing' && (
            <SecretariatLettersListView
              mode="outgoing"
              title="مدیریت نامه‌های صادره"
              letters={visibleLetters.filter((l) => l.type === 'outgoing' && !l.isDraft && !l.isDeleted)}
              onNewLetter={() => {
                setEditingDraftLetter({ defaultType: 'outgoing' });
                handleNavigate('sec_new');
              }}
              onOpenLetter={(id) => setSelectedLetterId(id)}
              onExportWord={(l) => exportLetterToDocx(l, secretariat.settings)}
              onDelete={handleSoftDeleteLetter}
            />
          )}

          {activeSection === 'sec_new' && (
            <SecretariatNewLetterView
              companies={companies}
              templates={secretariat.templates}
              settings={secretariat.settings}
              initialLetter={editingDraftLetter}
              onSaveLetter={(payload, finalize) => {
                handleSaveLetter(payload, finalize);
                setEditingDraftLetter(null);
                handleNavigate(finalize ? (payload.type === 'incoming' ? 'sec_incoming' : 'sec_outgoing') : 'sec_drafts');
              }}
              onExportWord={(l) => exportLetterToDocx(l, secretariat.settings)}
              onCancel={() => {
                setEditingDraftLetter(null);
                handleNavigate('sec_dashboard');
              }}
              showToast={showToast}
            />
          )}

          {activeSection === 'sec_my_tasks' && (
            <SecretariatMyTasksView
              tasks={secretariatStats.myTasksList}
              adminUser={adminUser}
              onOpenLetter={(id) => setSelectedLetterId(id)}
              onCompleteTask={(letterId, responseNote) => {
                const nowStr = getNowJalaliDateTime();
                setSecretariat((prev) => ({
                  ...prev,
                  letters: prev.letters.map((l) => {
                    if (l.id !== letterId) return l;
                    return {
                      ...l,
                      status: 'پاسخ داده‌شده',
                      referrals: (l.referrals || []).map((r) =>
                        r.toRole === adminUser?.secretariatRole && !r.completed
                          ? { ...r, completed: true, response: responseNote || 'بررسی و اقدام انجام شد.' }
                          : r
                      )
                    };
                  }),
                  auditLogs: [
                    {
                      id: 'log-' + Date.now(),
                      date: nowStr,
                      user: adminUser?.name || 'کاربر',
                      action: 'ثبت نتیجه اقدام برای نامه'
                    },
                    ...prev.auditLogs
                  ]
                }));
                showToast('نتیجه بررسی و اقدام در گردش مکاتبات ثبت شد.');
              }}
            />
          )}

          {activeSection === 'sec_workflow' && (
            <SecretariatWorkflowView
              letters={visibleLetters.filter((l) => !l.isDeleted && !l.isDraft)}
              onOpenLetter={(id) => setSelectedLetterId(id)}
            />
          )}

          {activeSection === 'sec_drafts' && (
            <SecretariatDraftsView
              drafts={visibleLetters.filter((l) => l.isDraft && !l.isDeleted)}
              onNewDraft={() => {
                setEditingDraftLetter({ defaultType: 'outgoing' });
                handleNavigate('sec_new');
              }}
              onEditDraft={(draft) => {
                setEditingDraftLetter(draft);
                handleNavigate('sec_new');
              }}
              onFinalizeDraft={(draft) => {
                handleSaveLetter(draft, true);
                handleNavigate('sec_outgoing');
              }}
              onDeleteDraft={handleSoftDeleteLetter}
            />
          )}

          {activeSection === 'sec_indicator' && (
            <SecretariatIndicatorView
              ledger={secretariat.indicatorLedger}
              settings={secretariat.settings}
              onOpenLetter={(letterId) => {
                const found = visibleLetters.find((l) => l.id === letterId && !l.isDeleted);
                if (found) setSelectedLetterId(letterId);
                else showToast('این نامه در وضعیت حذف‌شده قرار دارد و شماره آن در دفتر اندیکاتور محفوظ است.', 'info');
              }}
            />
          )}

          {activeSection === 'sec_archive' && (
            <SecretariatArchiveView
              archivedLetters={visibleLetters.filter(
                (l) => !l.isDeleted && (l.status === 'مختومه' || l.status === 'بایگانی‌شده')
              )}
              onOpenLetter={(id) => setSelectedLetterId(id)}
              onExportWord={(l) => exportLetterToDocx(l, secretariat.settings)}
            />
          )}

          {activeSection === 'sec_trash' && (
            <SecretariatTrashView
              deletedLetters={visibleLetters.filter((l) => l.isDeleted)}
              isSystemAdmin={adminUser?.secretariatRole === 'system_admin'}
              onRestore={handleRestoreLetter}
              onPermanentDelete={handlePermanentDeleteLetter}
            />
          )}

          {activeSection === 'sec_templates' && (
            <SecretariatTemplatesView
              templates={secretariat.templates}
              onSaveTemplate={(tpl) => {
                setSecretariat((prev) => {
                  const exists = prev.templates.some((t) => t.id === tpl.id);
                  const nextTpls = exists
                    ? prev.templates.map((t) => (t.id === tpl.id ? tpl : t))
                    : [{ ...tpl, id: 'tpl-' + Date.now() }, ...prev.templates];
                  return {
                    ...prev,
                    templates: nextTpls,
                    auditLogs: [
                      {
                        id: 'log-' + Date.now(),
                        date: getNowJalaliDateTime(),
                        user: adminUser?.name || 'کاربر',
                        action: `ذخیره قالب نامه: «${tpl.title}»`
                      },
                      ...prev.auditLogs
                    ]
                  };
                });
                showToast('قالب نامه با موفقیت ذخیره شد.');
              }}
              onDeleteTemplate={(id) => {
                setSecretariat((prev) => ({
                  ...prev,
                  templates: prev.templates.filter((t) => t.id !== id)
                }));
                showToast('قالب نامه حذف شد.');
              }}
              onUseTemplate={(tpl) => {
                setEditingDraftLetter({
                  defaultType: 'outgoing',
                  subject: tpl.subjectTemplate,
                  body: tpl.bodyTemplate,
                  signerName: tpl.signerName,
                  signerTitle: tpl.signerTitle
                });
                handleNavigate('sec_new');
              }}
            />
          )}

          {activeSection === 'sec_reports' && (
            <SecretariatReportsView
              letters={visibleLetters.filter((l) => !l.isDeleted)}
              onOpenLetter={(id) => setSelectedLetterId(id)}
              showToast={showToast}
            />
          )}

          {activeSection === 'sec_settings' && (
            <SecretariatSettingsView
              secretariat={secretariat}
              setSecretariat={setSecretariat}
              isSystemAdmin={adminUser?.secretariatRole === 'system_admin'}
              showToast={showToast}
            />
          )}
        </main>

        {selectedLetter && (
          <LetterDetailModal
            letter={selectedLetter}
            orgSettings={secretariat.settings}
            onClose={() => setSelectedLetterId(null)}
            onRefer={(refData) => handleReferLetter(selectedLetter.id, refData)}
            onUpdateStatus={(newStatus) => {
              const nowStr = getNowJalaliDateTime();
              setSecretariat((prev) => ({
                ...prev,
                letters: prev.letters.map((l) =>
                  l.id === selectedLetter.id ? { ...l, status: newStatus } : l
                ),
                auditLogs: [
                  {
                    id: 'log-' + Date.now(),
                    date: nowStr,
                    user: adminUser?.name || 'کاربر',
                    action: `تغییر وضعیت نامه ${selectedLetter.indicatorNumber} به «${newStatus}»`
                  },
                  ...prev.auditLogs
                ]
              }));
              showToast(`وضعیت نامه به «${newStatus}» تغییر یافت.`);
            }}
            onExportWord={() => {
              exportLetterToDocx(selectedLetter, secretariat.settings);
              showToast('فایل استاندارد Microsoft Word (.docx) دانلود شد.');
            }}
            onUploadNewWordVersion={(fileObj) => {
              const nowStr = getNowJalaliDateTime();
              setSecretariat((prev) => ({
                ...prev,
                letters: prev.letters.map((l) => {
                  if (l.id !== selectedLetter.id) return l;
                  const nextVer = (l.versions?.length || 0) + 1;
                  return {
                    ...l,
                    attachments: [fileObj, ...(l.attachments || [])],
                    versions: [
                      {
                        version: nextVer,
                        date: nowStr,
                        user: adminUser?.name || 'کاربر',
                        note: `بارگذاری نسخه ویرایش‌شده Word (${fileObj.name})`
                      },
                      ...(l.versions || [])
                    ]
                  };
                }),
                auditLogs: [
                  {
                    id: 'log-' + Date.now(),
                    date: nowStr,
                    user: adminUser?.name || 'کاربر',
                    action: `بارگذاری نسخه نهایی Word برای نامه ${selectedLetter.indicatorNumber}`
                  },
                  ...prev.auditLogs
                ]
              }));
              showToast('نسخه ویرایش‌شده Word در تاریخچه نسخه‌های نامه ثبت شد.');
            }}
          />
        )}

        <footer className="bg-[#081629] text-slate-400 border-t border-slate-800 mt-16 no-print">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center text-xs">
              <div>
                <div className="flex items-center gap-2 text-white font-bold text-sm mb-1.5">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  <span>مرکز رشد فناوری نخبگان — پارک فناوری پردیس</span>
                </div>
                <p className="text-slate-400 leading-5">
                  سامانه یکپارچه بانک اطلاعات شرکت‌های فناور و اتوماسیون مکاتبات دبیرخانه الکترونیکی
                </p>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>کیلومتر ۲۰ جاده دماوند، پارک فناوری پردیس</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <span>دبیرخانه مرکز رشد: ۰۲۱-۷۶۲۵۰۲۵۰</span>
                </div>
              </div>
              <div className="md:text-left text-slate-500">
                <p>تمامی حقوق متعلق به پارک فناوری پردیس می‌باشد.</p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ============================================================================
// ۵. کامپوننت‌های ماژول «دبیرخانه الکترونیکی»
// ============================================================================

function SecretariatDashboardView({ stats, letters, auditLogs, onNavigate, onOpenLetter }) {
  const kpiCards = [
    { label: 'کل نامه‌های وارده', value: stats.incomingCount, icon: Inbox, color: 'text-blue-700 bg-blue-50 border-blue-200', target: 'sec_incoming' },
    { label: 'کل نامه‌های صادره', value: stats.outgoingCount, icon: Send, color: 'text-emerald-700 bg-emerald-50 border-emerald-200', target: 'sec_outgoing' },
    { label: 'در انتظار اقدام', value: stats.pendingCount, icon: Clock, color: 'text-amber-700 bg-amber-50 border-amber-200', target: 'sec_incoming' },
    { label: 'نامه‌های ارجاع‌شده', value: stats.referredCount, icon: GitBranch, color: 'text-indigo-700 bg-indigo-50 border-indigo-200', target: 'sec_workflow' },
    { label: 'دارای مهلت پاسخ', value: stats.deadlineCount, icon: AlertTriangle, color: 'text-rose-700 bg-rose-50 border-rose-200', target: 'sec_my_tasks' },
    { label: 'نامه‌های بایگانی‌شده', value: stats.archivedCount, icon: Archive, color: 'text-slate-700 bg-slate-100 border-slate-200', target: 'sec_archive' },
    { label: 'پیش‌نویس‌های ذخیره‌شده', value: stats.draftsCount, icon: FileEdit, color: 'text-purple-700 bg-purple-50 border-purple-200', target: 'sec_drafts' }
  ];

  const recentLetters = letters.filter((l) => !l.isDeleted).slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#0f294a]">
            داشبورد دبیرخانه الکترونیکی
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            پایش لحظه‌ای مکاتبات اداری، نامه‌های وارده و صادره، ارجاعات و مهلت‌های پاسخ‌گویی
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigate('sec_new')}
            className="px-4 py-2.5 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
          >
            <FilePlus2 className="w-4 h-4" />
            <span>ثبت نامه جدید</span>
          </button>
          <button
            onClick={() => onNavigate('sec_indicator')}
            className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>دفتر اندیکاتور</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3.5">
        {kpiCards.map((c, idx) => (
          <div
            key={idx}
            onClick={() => onNavigate(c.target)}
            className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${c.color}`}>
                <c.icon className="w-4 h-4" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900">
                {toPersianDigits(c.value)}
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-600 leading-5">{c.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Mail className="w-4 h-4 text-blue-600" />
              آخرین مکاتبات ثبت‌شده در دبیرخانه
            </h3>
            <button
              onClick={() => onNavigate('sec_reports')}
              className="text-xs text-blue-700 font-semibold hover:underline"
            >
              مشاهده همه مکاتبات
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">شماره اندیکاتور</th>
                  <th className="py-3 px-4">نوع</th>
                  <th className="py-3 px-4">موضوع نامه</th>
                  <th className="py-3 px-4">فرستنده / گیرنده</th>
                  <th className="py-3 px-4">وضعیت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentLetters.map((l) => (
                  <tr
                    key={l.id}
                    onClick={() => onOpenLetter(l.id)}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-800">
                      {toPersianDigits(l.indicatorNumber || 'پیش‌نویس')}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full font-semibold ${
                          l.type === 'incoming'
                            ? 'bg-blue-50 text-blue-700'
                            : l.type === 'outgoing'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {l.type === 'incoming' ? 'وارده' : l.type === 'outgoing' ? 'صادره' : 'داخلی'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800 max-w-xs truncate">
                      {l.subject}
                    </td>
                    <td className="py-3 px-4 text-slate-600 truncate max-w-[140px]">
                      {l.type === 'incoming' ? l.senderOrg || l.senderName : l.recipientOrg || l.recipientName}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-medium">
                        {l.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
            <History className="w-4 h-4 text-blue-600" />
            آخرین فعالیت‌های ثبت‌شده
          </h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {(auditLogs || []).slice(0, 8).map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                  <span className="font-semibold text-slate-600">{log.user}</span>
                  <span dir="ltr">{toPersianDigits(log.date)}</span>
                </div>
                <p className="text-slate-800 leading-5">{log.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SecretariatLettersListView({
  mode,
  title,
  letters,
  onNewLetter,
  onOpenLetter,
  onExportWord,
  onDelete
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('همه');
  const [yearFilter, setYearFilter] = useState('همه');

  const years = ['همه', ...new Set(letters.map((l) => l.year).filter(Boolean))];
  const statuses = ['همه', ...new Set(letters.map((l) => l.status).filter(Boolean))];

  const filtered = letters.filter((l) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      (l.subject && l.subject.toLowerCase().includes(q)) ||
      (l.indicatorNumber && l.indicatorNumber.toLowerCase().includes(q)) ||
      (l.senderOrg && l.senderOrg.toLowerCase().includes(q)) ||
      (l.recipientOrg && l.recipientOrg.toLowerCase().includes(q)) ||
      (l.originLetterNumber && l.originLetterNumber.toLowerCase().includes(q));
    const matchStatus = statusFilter === 'همه' || l.status === statusFilter;
    const matchYear = yearFilter === 'همه' || l.year === yearFilter;
    return matchQ && matchStatus && matchYear;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">{title}</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            تعداد کل رکوردها: {toPersianDigits(filtered.length)} نامه
          </p>
        </div>
        <button
          onClick={onNewLetter}
          className="px-4 py-2.5 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs sm:text-sm font-bold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{mode === 'incoming' ? 'ثبت نامه وارده جدید' : 'ایجاد نامه صادره جدید'}</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="sm:col-span-2 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو بر اساس شماره اندیکاتور، موضوع، سازمان یا شماره نامه مبدأ..."
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs outline-none focus:border-blue-600"
          />
        </div>
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              سال: {toPersianDigits(y)}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
        >
          {statuses.map((s) => (
            <option key={s} value={s}>
              وضعیت: {s}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">شماره اندیکاتور</th>
                <th className="py-3.5 px-4">تاریخ</th>
                <th className="py-3.5 px-4">{mode === 'incoming' ? 'فرستنده / سازمان' : 'گیرنده / سازمان'}</th>
                <th className="py-3.5 px-4">موضوع نامه</th>
                <th className="py-3.5 px-4">فوریت / محرمانگی</th>
                <th className="py-3.5 px-4">وضعیت</th>
                <th className="py-3.5 px-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-slate-400">
                    نامه‌ای با این مشخصات یافت نشد.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-800">
                      {toPersianDigits(l.indicatorNumber)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{toPersianDigits(l.letterDate)}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800">
                        {mode === 'incoming' ? l.senderOrg || l.senderName : l.recipientOrg || l.recipientName}
                      </div>
                      {mode === 'incoming' && l.originLetterNumber && (
                        <div className="text-[11px] text-slate-400">
                          شماره مبدأ: {toPersianDigits(l.originLetterNumber)}
                        </div>
                      )}
                    </td>
                    <td
                      onClick={() => onOpenLetter(l.id)}
                      className="py-3.5 px-4 font-semibold text-slate-900 hover:text-blue-700 cursor-pointer max-w-xs truncate"
                    >
                      {l.subject}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded-md font-semibold ${
                            l.priority === 'آنی'
                              ? 'bg-rose-100 text-rose-800'
                              : l.priority === 'فوری'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {l.priority}
                        </span>
                        {l.confidentiality !== 'عادی' && (
                          <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 font-semibold">
                            {l.confidentiality}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 font-semibold">
                        {l.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => onOpenLetter(l.id)}
                          title="مشاهده، ارجاع و جزئیات"
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onExportWord(l)}
                          title="دریافت فایل Word (.docx)"
                          className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(l)}
                          title="انتقال به حذف‌شده‌ها"
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SecretariatNewLetterView({
  companies,
  templates,
  settings,
  initialLetter,
  onSaveLetter,
  onExportWord,
  onCancel,
  showToast
}) {
  const [form, setForm] = useState(() => ({
    id: initialLetter?.id || '',
    type: initialLetter?.type || initialLetter?.defaultType || 'incoming',
    indicatorNumber: initialLetter?.indicatorNumber || '',
    senderType: initialLetter?.senderType || 'حقوقی',
    senderName: initialLetter?.senderName || '',
    senderOrg: initialLetter?.senderOrg || '',
    originLetterNumber: initialLetter?.originLetterNumber || '',
    letterDate: initialLetter?.letterDate || getTodayJalali(),
    receiptDate: initialLetter?.receiptDate || getTodayJalali(),
    recipientName: initialLetter?.recipientName || '',
    recipientOrg: initialLetter?.recipientOrg || '',
    subject: initialLetter?.subject || '',
    summary: initialLetter?.summary || '',
    body: initialLetter?.body || '',
    priority: initialLetter?.priority || 'عادی',
    confidentiality: initialLetter?.confidentiality || 'عادی',
    status: initialLetter?.status || 'ثبت اولیه',
    deadline: initialLetter?.deadline || '',
    assignedToRole: initialLetter?.assignedToRole || 'org_manager',
    assignedToName: initialLetter?.assignedToName || 'دکتر رضایی (رئیس مرکز رشد)',
    ccList: initialLetter?.ccList || [],
    signerName: initialLetter?.signerName || 'دکتر حمیدرضا رضایی',
    signerTitle: initialLetter?.signerTitle || 'رئیس مرکز رشد فناوری نخبگان',
    attachments: initialLetter?.attachments || [],
    versions: initialLetter?.versions || [],
    referrals: initialLetter?.referrals || []
  }));

  const [ccInput, setCcInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const handleApplyTemplate = (tplId) => {
    const tpl = templates.find((t) => t.id === tplId);
    if (!tpl) return;
    const targetName = form.recipientOrg || form.recipientName || 'شرکت محترم';
    const subj = tpl.subjectTemplate
      .replace('{{گیرنده}}', targetName)
      .replace('{{موضوع}}', form.subject || 'فناوری');
    const body = tpl.bodyTemplate
      .replace(/\{\{گیرنده\}\}/g, targetName)
      .replace(/\{\{موضوع\}\}/g, form.subject || 'فناوری')
      .replace(/\{\{تاریخ\}\}/g, form.letterDate);

    setForm((prev) => ({
      ...prev,
      subject: subj,
      body,
      signerName: tpl.signerName || prev.signerName,
      signerTitle: tpl.signerTitle || prev.signerTitle
    }));
    showToast(`قالب «${tpl.title}» اعمال شد.`);
  };

  const handleFileAttach = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const newAtt = {
          id: 'att-' + Date.now() + Math.random().toString(16).slice(2, 5),
          name: file.name,
          size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
          type: file.type,
          dataUrl: reader.result,
          date: getTodayJalali()
        };
        setForm((prev) => ({ ...prev, attachments: [...prev.attachments, newAtt] }));
      };
      reader.readAsDataURL(file);
    });
    showToast(`${toPersianDigits(files.length)} فایل پیوست اضافه شد.`);
  };

  const handleSubmit = (finalize) => {
    if (!form.subject.trim()) {
      showToast('وارد کردن «موضوع نامه» الزامی است.', 'error');
      return;
    }
    onSaveLetter(form, finalize);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-extrabold text-[#0f294a]">
              {form.id ? 'ویرایش مکاتبه / پیش‌نویس' : 'ثبت نامه جدید در دبیرخانه الکترونیکی'}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              شماره اندیکاتور نامه صادره پس از «تأیید و ثبت نهایی» به‌صورت خودکار و یکتا تخصیص می‌یابد.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 text-xs font-semibold flex items-center gap-1.5"
            >
              <Eye className="w-4 h-4" />
              <span>{showPreview ? 'بازگشت به فرم' : 'پیش‌نمایش سربرگ'}</span>
            </button>
            <button
              type="button"
              onClick={() => onExportWord(form)}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-200 text-xs font-semibold flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>خروجی Word (.docx)</span>
            </button>
          </div>
        </div>

        {showPreview ? (
          <div className="p-8 bg-slate-100">
            <OfficialLetterPaper letter={form} settings={settings} />
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-blue-50/60 border border-blue-200/80">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">نوع مکاتبه</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'incoming', label: 'نامه وارده' },
                    { id: 'outgoing', label: 'نامه صادره' },
                    { id: 'internal', label: 'مکاتبه داخلی' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setForm((p) => ({ ...p, type: t.id }))}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                        form.type === t.id
                          ? 'bg-[#0f294a] text-white border-[#0f294a]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1.5">
                  استفاده از قالب آماده نامه‌نگاری
                </label>
                <select
                  onChange={(e) => handleApplyTemplate(e.target.value)}
                  defaultValue=""
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-white"
                >
                  <option value="" disabled>
                    — انتخاب قالب استاندارد سازمانی —
                  </option>
                  {templates.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {form.type === 'incoming' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نوع فرستنده</label>
                  <select
                    value={form.senderType}
                    onChange={(e) => setForm({ ...form, senderType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    <option value="حقوقی">شخص حقوقی (شرکت / سازمان)</option>
                    <option value="حقیقی">شخص حقیقی</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شرکت یا سازمان فرستنده
                  </label>
                  <input
                    list="companies-datalist"
                    value={form.senderOrg}
                    onChange={(e) => setForm({ ...form, senderOrg: e.target.value })}
                    placeholder="نام شرکت یا سازمان..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نام و سمت فرستنده</label>
                  <input
                    type="text"
                    value={form.senderName}
                    onChange={(e) => setForm({ ...form, senderName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">شماره نامه مبدأ (فرستنده)</label>
                  <input
                    type="text"
                    value={form.originLetterNumber}
                    onChange={(e) => setForm({ ...form, originLetterNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ نامه مبدأ (شمسی)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.letterDate}
                    onChange={(e) => setForm({ ...form, letterDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ دریافت در دبیرخانه</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.receiptDate}
                    onChange={(e) => setForm({ ...form, receiptDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    سازمان یا شرکت مخاطب (گیرنده)
                  </label>
                  <input
                    list="companies-datalist"
                    value={form.recipientOrg}
                    onChange={(e) => setForm({ ...form, recipientOrg: e.target.value })}
                    placeholder="انتخاب شرکت عضو یا تایپ سازمان..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    شخص یا مقام دریافت‌کننده
                  </label>
                  <input
                    type="text"
                    value={form.recipientName}
                    onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
                    placeholder="مثال: مدیرعامل محترم شرکت..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">تاریخ نامه (شمسی)</label>
                  <input
                    type="text"
                    dir="ltr"
                    value={form.letterDate}
                    onChange={(e) => setForm({ ...form, letterDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>
            )}

            <datalist id="companies-datalist">
              {companies.map((c) => (
                <option key={c.id} value={c.name} />
              ))}
            </datalist>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  موضوع نامه <span className="text-rose-600">*</span>
                </label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">فوریت و اهمیت</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="عادی">عادی</option>
                  <option value="فوری">فوری</option>
                  <option value="آنی">آنی</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">سطح محرمانگی</label>
                <select
                  value={form.confidentiality}
                  onChange={(e) => setForm({ ...form, confidentiality: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                >
                  <option value="عادی">عادی</option>
                  <option value="محرمانه">محرمانه</option>
                  <option value="خیلی محرمانه">خیلی محرمانه</option>
                </select>
              </div>
            </div>

            {form.type === 'incoming' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">مهلت پاسخ‌گویی (شمسی)</label>
                  <input
                    type="text"
                    dir="ltr"
                    placeholder="1405/02/10"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">وضعیت رسیدگی</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {INCOMING_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ارجاع اولیه به</label>
                  <select
                    value={form.assignedToRole}
                    onChange={(e) => {
                      const roleObj = SECRETARIAT_ROLES.find((r) => r.id === e.target.value);
                      setForm({
                        ...form,
                        assignedToRole: e.target.value,
                        assignedToName: roleObj?.userDisplayName || ''
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm bg-white"
                  >
                    {SECRETARIAT_ROLES.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.userDisplayName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">متن و شرح نامه</label>
              <textarea
                rows={7}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="متن رسمی نامه را بنویسید یا از قالب‌های آماده انتخاب کنید..."
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm leading-7 focus:border-blue-600 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">نام امضاکننده</label>
                  <input
                    type="text"
                    value={form.signerName}
                    onChange={(e) => setForm({ ...form, signerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">سمت امضاکننده</label>
                  <input
                    type="text"
                    value={form.signerTitle}
                    onChange={(e) => setForm({ ...form, signerTitle: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">رونوشت (CC)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ccInput}
                    onChange={(e) => setCcInput(e.target.value)}
                    placeholder="نام واحد یا شخص جهت رونوشت..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!ccInput.trim()) return;
                      setForm((p) => ({ ...p, ccList: [...p.ccList, ccInput.trim()] }));
                      setCcInput('');
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    افزودن
                  </button>
                </div>
                {form.ccList.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.ccList.map((cc, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] flex items-center gap-1"
                      >
                        {cc}
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({ ...p, ccList: p.ccList.filter((_, i) => i !== idx) }))
                          }
                        >
                          <X className="w-3 h-3 text-rose-500" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-slate-700">
                  پیوست‌های نامه (PDF, Word, تصاویر)
                </span>
                <label className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:bg-blue-50 text-blue-700 text-xs font-semibold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-3.5 h-3.5" />
                  <span>افزودن فایل پیوست</span>
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileAttach}
                    className="hidden"
                  />
                </label>
              </div>
              {form.attachments.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {form.attachments.map((att, idx) => (
                    <div
                      key={att.id || idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 text-xs"
                    >
                      <span className="truncate font-medium text-slate-800">{att.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-400">{att.size}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm((p) => ({
                              ...p,
                              attachments: p.attachments.filter((_, i) => i !== idx)
                            }))
                          }
                        >
                          <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold flex items-center gap-1.5"
              >
                <FileEdit className="w-4 h-4" />
                <span>ذخیره به‌عنوان پیش‌نویس</span>
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>تأیید و ثبت نهایی (تخصیص شماره اندیکاتور)</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SecretariatMyTasksView({ tasks, adminUser, onOpenLetter, onCompleteTask }) {
  const [responseTexts, setResponseTexts] = useState({});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#0f294a]">
          کارتابل شخصی: کارهای ارجاع‌شده به من
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          کاربر فعال: <b>{adminUser?.name}</b> — تعداد مکاتبات منتظر اقدام: {toPersianDigits(tasks.length)} مورد
        </p>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
          <CheckSquare className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
          <h3 className="font-bold text-slate-800">کارتابل شما به‌روز است</h3>
          <p className="text-xs text-slate-500 mt-1">هیچ نامه ارجاع‌شده‌ای در انتظار اقدام شما نیست.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const latestRef = (task.referrals || []).find(
              (r) => r.toRole === adminUser?.secretariatRole && !r.completed
            );
            return (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-lg">
                        {toPersianDigits(task.indicatorNumber)}
                      </span>
                      {latestRef && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-800">
                          نوع ارجاع: {latestRef.referralType}
                        </span>
                      )}
                      {task.deadline && (
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                          مهلت اقدام: {toPersianDigits(task.deadline)}
                        </span>
                      )}
                    </div>
                    <h3
                      onClick={() => onOpenLetter(task.id)}
                      className="font-bold text-base text-slate-900 hover:text-blue-700 cursor-pointer"
                    >
                      {task.subject}
                    </h3>
                    {latestRef && (
                      <p className="text-xs text-slate-600 mt-1">
                        ارجاع‌دهنده: <b>{latestRef.fromUser}</b> — هامش / دستور: «{latestRef.instructions}»
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => onOpenLetter(task.id)}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold"
                  >
                    مشاهده متن کامل و ارجاع مجدد
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-slate-100">
                  <input
                    type="text"
                    value={responseTexts[task.id] || ''}
                    onChange={(e) =>
                      setResponseTexts((prev) => ({ ...prev, [task.id]: e.target.value }))
                    }
                    placeholder="ثبت نتیجه بررسی، شرح اقدام یا پاسخ کارشناسی..."
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
                  />
                  <button
                    onClick={() => onCompleteTask(task.id, responseTexts[task.id])}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <Check className="w-4 h-4" />
                    <span>ثبت نتیجه و تکمیل اقدام</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SecretariatWorkflowView({ letters, onOpenLetter }) {
  const referredLetters = letters.filter((l) => (l.referrals?.length || 0) > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#0f294a]">گردش مکاتبات و تاریخچه ارجاعات</h1>
        <p className="text-xs text-slate-500 mt-1">
          مشاهده مسیر حرکت نامه‌ها میان مدیریت، دبیرخانه و کارشناسان مرکز رشد
        </p>
      </div>

      <div className="space-y-4">
        {referredLetters.map((l) => (
          <div key={l.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-1 rounded-lg">
                  {toPersianDigits(l.indicatorNumber)}
                </span>
                <h3 className="font-bold text-sm text-slate-900">{l.subject}</h3>
              </div>
              <button
                onClick={() => onOpenLetter(l.id)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700"
              >
                ارجاع مجدد / جزئیات
              </button>
            </div>

            <div className="space-y-2.5 pr-4 border-r-2 border-blue-200">
              {l.referrals.map((ref) => (
                <div key={ref.id} className="p-3 rounded-xl bg-slate-50 text-xs">
                  <div className="flex flex-wrap justify-between gap-2 text-slate-500 mb-1">
                    <span>
                      از: <b className="text-slate-800">{ref.fromUser}</b> ⟵ به:{' '}
                      <b className="text-blue-800">{ref.toName}</b> ({ref.referralType})
                    </span>
                    <span dir="ltr">{toPersianDigits(ref.date)}</span>
                  </div>
                  {ref.instructions && <p className="text-slate-700">دستور/هامش: {ref.instructions}</p>}
                  {ref.response && (
                    <p className="text-emerald-700 font-semibold mt-1">نتیجه اقدام: {ref.response}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecretariatDraftsView({ drafts, onNewDraft, onEditDraft, onFinalizeDraft, onDeleteDraft }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">پیش‌نویس‌های مکاتبات</h1>
          <p className="text-xs text-slate-500 mt-1">
            نامه‌هایی که هنوز شماره اندیکاتور نهایی دریافت نکرده‌اند و قابل ویرایش هستند.
          </p>
        </div>
        <button
          onClick={onNewDraft}
          className="px-4 py-2 rounded-xl bg-[#0f294a] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>ایجاد پیش‌نویس جدید</span>
        </button>
      </div>

      {drafts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-sm text-slate-500">
          پیش‌نویسی ذخیره نشده است.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {drafts.map((d) => (
            <div key={d.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    پیش‌نویس ({d.type === 'incoming' ? 'وارده' : 'صادره'})
                  </span>
                  <span className="text-slate-400">{toPersianDigits(d.letterDate)}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1">{d.subject}</h3>
                <p className="text-xs text-slate-500 mb-3">
                  مخاطب: {d.recipientOrg || d.recipientName || 'تعیین نشده'}
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => onEditDraft(d)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  ویرایش متن
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onFinalizeDraft(d)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    تبدیل به نامه صادره و شماره‌گذاری
                  </button>
                  <button
                    onClick={() => onDeleteDraft(d)}
                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SecretariatIndicatorView({ ledger, settings, onOpenLetter }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('همه');

  const filtered = ledger.filter((item) => {
    const q = search.trim().toLowerCase();
    const matchQ =
      !q ||
      (item.indicatorNumber && item.indicatorNumber.toLowerCase().includes(q)) ||
      (item.subject && item.subject.toLowerCase().includes(q)) ||
      (item.party && item.party.toLowerCase().includes(q));
    const matchType = typeFilter === 'همه' || item.type === typeFilter;
    return matchQ && matchType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">
            دفتر اندیکاتور الکترونیکی (سال {toPersianDigits(settings.currentYear)})
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            ثبت تراکنشی و یکتا با حفظ شماره‌های استفاده‌شده حتی در صورت حذف نرم مکاتبات
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs bg-white px-4 py-2.5 rounded-xl border border-slate-200">
          <span>شماره بعدی وارده: <b className="font-mono text-blue-700">{toPersianDigits(settings.nextIncomingSeq)}</b></span>
          <span className="text-slate-300">|</span>
          <span>شماره بعدی صادره: <b className="font-mono text-emerald-700">{toPersianDigits(settings.nextOutgoingSeq)}</b></span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جست‌وجو بر اساس شماره اندیکاتور، موضوع یا طرف مکاتبه..."
            className="w-full pr-9 pl-3 py-2 rounded-xl border border-slate-300 text-xs"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs bg-slate-50"
        >
          <option value="همه">همه انواع اندیکاتور</option>
          <option value="وارده">نامه‌های وارده</option>
          <option value="صادره">نامه‌های صادره</option>
          <option value="داخلی">مکاتبات داخلی</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">شماره اندیکاتور</th>
                <th className="py-3.5 px-4">نوع ثبت</th>
                <th className="py-3.5 px-4">تاریخ و ساعت ثبت</th>
                <th className="py-3.5 px-4">موضوع</th>
                <th className="py-3.5 px-4">فرستنده / گیرنده</th>
                <th className="py-3.5 px-4">کاربر ثبت‌کننده</th>
                <th className="py-3.5 px-4">وضعیت سابقه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onOpenLetter(item.letterId)}
                  className="hover:bg-blue-50/40 cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                    {toPersianDigits(item.indicatorNumber)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-semibold ${
                        item.type === 'وارده' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600" dir="ltr">
                    {toPersianDigits(item.registeredAt)}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">{item.subject}</td>
                  <td className="py-3.5 px-4 text-slate-600">{item.party}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.registeredBy}</td>
                  <td className="py-3.5 px-4">
                    {item.isLetterDeleted ? (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-semibold">
                        شماره محفوظ (نامه در سطل حذف)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        فعال در پرونده
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SecretariatArchiveView({ archivedLetters, onOpenLetter, onExportWord }) {
  const [search, setSearch] = useState('');
  const filtered = archivedLetters.filter(
    (l) =>
      !search ||
      (l.subject && l.subject.includes(search)) ||
      (l.indicatorNumber && l.indicatorNumber.includes(search))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#0f294a]">بایگانی راکد و مکاتبات مختومه</h1>
        <p className="text-xs text-slate-500 mt-1">
          نگهداری سوابق نامه‌های مختومه و بازیابی پرونده‌های بایگانی‌شده
        </p>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-200">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جست‌وجو در بایگانی بر اساس شماره اندیکاتور یا موضوع..."
          className="w-full max-w-md px-3.5 py-2 rounded-xl border border-slate-300 text-xs"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">شماره اندیکاتور</th>
              <th className="py-3.5 px-4">تاریخ</th>
              <th className="py-3.5 px-4">موضوع</th>
              <th className="py-3.5 px-4">طرف مکاتبه</th>
              <th className="py-3.5 px-4 text-center">مشاهده / دریافت Word</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  پرونده‌ای در بایگانی ثبت نشده است.
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                    {toPersianDigits(l.indicatorNumber)}
                  </td>
                  <td className="py-3.5 px-4">{toPersianDigits(l.letterDate)}</td>
                  <td className="py-3.5 px-4 font-semibold">{l.subject}</td>
                  <td className="py-3.5 px-4">{l.senderOrg || l.recipientOrg}</td>
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onOpenLetter(l.id)}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-semibold"
                      >
                        مشاهده سابقه
                      </button>
                      <button
                        onClick={() => onExportWord(l)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-semibold"
                      >
                        Word
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SecretariatTrashView({ deletedLetters, isSystemAdmin, onRestore, onPermanentDelete }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#0f294a]">نامه‌های حذف‌شده (حذف نرم)</h1>
        <p className="text-xs text-slate-500 mt-1">
          شماره اندیکاتور نامه‌های حذف‌شده در دفتر اندیکاتور محفوظ می‌ماند. حذف دائمی فقط با مجوز «مدیر سیستم» امکان‌پذیر است.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">شماره اندیکاتور</th>
              <th className="py-3.5 px-4">موضوع نامه</th>
              <th className="py-3.5 px-4">کاربر حذف‌کننده</th>
              <th className="py-3.5 px-4">زمان حذف</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deletedLetters.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-10 text-center text-slate-400">
                  موردی در بخش حذف‌شده‌ها وجود ندارد.
                </td>
              </tr>
            ) : (
              deletedLetters.map((l) => (
                <tr key={l.id}>
                  <td className="py-3.5 px-4 font-mono font-bold text-rose-700">
                    {toPersianDigits(l.indicatorNumber || 'پیش‌نویس')}
                  </td>
                  <td className="py-3.5 px-4 font-semibold">{l.subject}</td>
                  <td className="py-3.5 px-4">{l.deletedBy}</td>
                  <td className="py-3.5 px-4" dir="ltr">
                    {toPersianDigits(l.deletedAt)}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => onRestore(l)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-semibold flex items-center gap-1"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                        بازیابی نامه
                      </button>
                      {isSystemAdmin && (
                        <button
                          onClick={() => onPermanentDelete(l)}
                          className="px-3 py-1.5 rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-semibold"
                        >
                          حذف دائمی
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
  );
}

function SecretariatTemplatesView({ templates, onSaveTemplate, onDeleteTemplate, onUseTemplate }) {
  const [editingTpl, setEditingTpl] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">قالب‌های آماده مکاتبات اداری</h1>
          <p className="text-xs text-slate-500 mt-1">
            مدیریت الگوهای استاندارد با متغیرهای پویا ({'{{گیرنده}}'}, {'{{موضوع}}'}, {'{{تاریخ}}'})
          </p>
        </div>
        <button
          onClick={() =>
            setEditingTpl({
              id: '',
              title: '',
              category: 'عمومی',
              subjectTemplate: '',
              bodyTemplate: 'با سلام و احترام؛\n\n',
              signerName: 'دکتر حمیدرضا رضایی',
              signerTitle: 'رئیس مرکز رشد فناوری نخبگان'
            })
          }
          className="px-4 py-2 rounded-xl bg-[#0f294a] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف قالب جدید</span>
        </button>
      </div>

      {editingTpl && (
        <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-md space-y-4">
          <h3 className="font-bold text-sm text-slate-900">ویرایش / ایجاد قالب نامه</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">عنوان قالب</label>
              <input
                type="text"
                value={editingTpl.title}
                onChange={(e) => setEditingTpl({ ...editingTpl, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">دسته‌بندی</label>
              <input
                type="text"
                value={editingTpl.category}
                onChange={(e) => setEditingTpl({ ...editingTpl, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">الگوی موضوع نامه</label>
              <input
                type="text"
                value={editingTpl.subjectTemplate}
                onChange={(e) => setEditingTpl({ ...editingTpl, subjectTemplate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold mb-1">متن پیش‌فرض نامه</label>
              <textarea
                rows={5}
                value={editingTpl.bodyTemplate}
                onChange={(e) => setEditingTpl({ ...editingTpl, bodyTemplate: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setEditingTpl(null)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold"
            >
              انصراف
            </button>
            <button
              onClick={() => {
                if (!editingTpl.title) return;
                onSaveTemplate(editingTpl);
                setEditingTpl(null);
              }}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              ذخیره قالب
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {templates.map((tpl) => (
          <div key={tpl.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-800">
                  {tpl.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingTpl(tpl)}
                    className="p-1.5 text-slate-500 hover:text-amber-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteTemplate(tpl.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-2">{tpl.title}</h3>
              <p className="text-xs text-slate-600 whitespace-pre-line line-clamp-4 bg-slate-50 p-3 rounded-xl">
                {tpl.bodyTemplate}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onUseTemplate(tpl)}
                className="px-4 py-2 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs font-semibold"
              >
                استفاده از این قالب در ثبت نامه جدید
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecretariatReportsView({ letters, onOpenLetter, showToast }) {
  const [filters, setFilters] = useState({
    indicator: '',
    originNumber: '',
    date: '',
    subject: '',
    party: '',
    bodyText: '',
    status: 'همه',
    type: 'همه'
  });

  const results = useMemo(() => {
    return letters.filter((l) => {
      if (filters.indicator && !String(l.indicatorNumber || '').includes(filters.indicator)) return false;
      if (filters.originNumber && !String(l.originLetterNumber || '').includes(filters.originNumber)) return false;
      if (filters.date && !String(l.letterDate || '').includes(filters.date)) return false;
      if (filters.subject && !String(l.subject || '').includes(filters.subject)) return false;
      if (
        filters.party &&
        !`${l.senderName} ${l.senderOrg} ${l.recipientName} ${l.recipientOrg}`.includes(filters.party)
      )
        return false;
      if (filters.bodyText && !String(l.body || '').includes(filters.bodyText)) return false;
      if (filters.status !== 'همه' && l.status !== filters.status) return false;
      if (filters.type !== 'همه' && l.type !== filters.type) return false;
      return true;
    });
  }, [letters, filters]);

  const handleExportReportExcel = () => {
    if (!window.XLSX) {
      showToast('کتابخانه اکسل در حال بارگذاری است، لطفاً چند ثانیه صبر کنید.', 'error');
      return;
    }
    const rows = results.map((l) => ({
      'شماره اندیکاتور': l.indicatorNumber || 'پیش‌نویس',
      'نوع مکاتبه': l.type === 'incoming' ? 'وارده' : l.type === 'outgoing' ? 'صادره' : 'داخلی',
      'تاریخ نامه': l.letterDate,
      'موضوع': l.subject,
      'فرستنده': `${l.senderName || ''} (${l.senderOrg || ''})`,
      'گیرنده': `${l.recipientName || ''} (${l.recipientOrg || ''})`,
      'شماره نامه مبدأ': l.originLetterNumber || '',
      'وضعیت': l.status,
      'فوریت': l.priority,
      'محرمانگی': l.confidentiality,
      'کارشناس / مسئول': l.assignedToName || ''
    }));
    const ws = window.XLSX.utils.json_to_sheet(rows);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, 'گزارش مکاتبات');
    window.XLSX.writeFile(wb, `Secretariat_Report_${getTodayJalali().replace(/\//g, '-')}.xlsx`);
    showToast('گزارش اکسل مکاتبات دانلود شد.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-xl font-extrabold text-[#0f294a]">جست‌وجوی جامع و گزارش‌ساز دبیرخانه</h1>
          <p className="text-xs text-slate-500 mt-1">
            جست‌وجوی ترکیبی در تمام مکاتبات و دریافت خروجی Excel و PDF
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportReportExcel}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>خروجی Excel ({toPersianDigits(results.length)})</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs font-bold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>چاپ / خروجی PDF</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs no-print">
        <input
          type="text"
          placeholder="شماره اندیکاتور..."
          value={filters.indicator}
          onChange={(e) => setFilters({ ...filters, indicator: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <input
          type="text"
          placeholder="شماره نامه مبدأ..."
          value={filters.originNumber}
          onChange={(e) => setFilters({ ...filters, originNumber: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <input
          type="text"
          placeholder="تاریخ (مثلاً 1405/01)..."
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <input
          type="text"
          placeholder="موضوع نامه..."
          value={filters.subject}
          onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <input
          type="text"
          placeholder="فرستنده، گیرنده یا نام شرکت..."
          value={filters.party}
          onChange={(e) => setFilters({ ...filters, party: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <input
          type="text"
          placeholder="جست‌وجو در متن نامه..."
          value={filters.bodyText}
          onChange={(e) => setFilters({ ...filters, bodyText: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300"
        />
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
        >
          <option value="همه">نوع مکاتبه: همه</option>
          <option value="incoming">وارده</option>
          <option value="outgoing">صادره</option>
          <option value="internal">داخلی</option>
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-3 py-2 rounded-xl border border-slate-300 bg-white"
        >
          <option value="همه">وضعیت نامه: همه</option>
          {INCOMING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
          <option value="ارسال‌شده">ارسال‌شده</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">اندیکاتور</th>
                <th className="py-3 px-4">نوع</th>
                <th className="py-3 px-4">تاریخ</th>
                <th className="py-3 px-4">موضوع</th>
                <th className="py-3 px-4">طرف مکاتبه</th>
                <th className="py-3 px-4">مسئول پیگیری</th>
                <th className="py-3 px-4">وضعیت</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((l) => (
                <tr
                  key={l.id}
                  onClick={() => onOpenLetter(l.id)}
                  className="hover:bg-blue-50/40 cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-blue-800">
                    {toPersianDigits(l.indicatorNumber || 'پیش‌نویس')}
                  </td>
                  <td className="py-3 px-4">{l.type === 'incoming' ? 'وارده' : 'صادره'}</td>
                  <td className="py-3 px-4">{toPersianDigits(l.letterDate)}</td>
                  <td className="py-3 px-4 font-semibold">{l.subject}</td>
                  <td className="py-3 px-4">{l.senderOrg || l.recipientOrg}</td>
                  <td className="py-3 px-4 text-slate-500">{l.assignedToName}</td>
                  <td className="py-3 px-4">{l.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SecretariatSettingsView({ secretariat, setSecretariat, isSystemAdmin, showToast }) {
  const [formSettings, setFormSettings] = useState(secretariat.settings);

  const handleSave = (e) => {
    e.preventDefault();
    if (!isSystemAdmin) {
      showToast('فقط مدیر سیستم مجوز تغییر الگوی شماره‌گذاری را دارد.', 'error');
      return;
    }
    setSecretariat((prev) => ({ ...prev, settings: formSettings }));
    showToast('تنظیمات شماره‌گذاری و سربرگ دبیرخانه ذخیره شد.');
  };

  const handleBackupSecretariat = () => {
    const blob = new Blob([JSON.stringify(secretariat, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `secretariat-backup-${getTodayJalali().replace(/\//g, '-')}.json`;
    a.click();
    showToast('نسخه پشتیبان کامل دبیرخانه دانلود شد.');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-[#0f294a]">تنظیمات دبیرخانه و الگوی اندیکاتور</h1>
        <p className="text-xs text-slate-500 mt-1">
          پیکربندی سال شمسی، الگوی شماره‌دهی خودکار، سربرگ رسمی و پشتیبان‌گیری
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">سال شمسی فعال اندیکاتور</label>
            <input
              type="text"
              value={formSettings.currentYear}
              onChange={(e) => setFormSettings({ ...formSettings, currentYear: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">الگوی شماره نامه‌های وارده</label>
            <input
              type="text"
              dir="ltr"
              value={formSettings.incomingPattern}
              onChange={(e) => setFormSettings({ ...formSettings, incomingPattern: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div>
            <label className="block font-bold text-slate-700 mb-1">الگوی شماره نامه‌های صادره</label>
            <input
              type="text"
              dir="ltr"
              value={formSettings.outgoingPattern}
              onChange={(e) => setFormSettings({ ...formSettings, outgoingPattern: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block font-bold text-slate-700 mb-1">عنوان سطر اول سربرگ رسمی</label>
            <input
              type="text"
              value={formSettings.orgHeaderTitle}
              onChange={(e) => setFormSettings({ ...formSettings, orgHeaderTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
          <div className="md:col-span-3">
            <label className="block font-bold text-slate-700 mb-1">عنوان سطر دوم سربرگ رسمی</label>
            <input
              type="text"
              value={formSettings.orgSubTitle}
              onChange={(e) => setFormSettings({ ...formSettings, orgSubTitle: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackupSecretariat}
            className="px-4 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>تهیه نسخه پشتیبان دبیرخانه (JSON)</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#0f294a] hover:bg-blue-800 text-white text-xs font-bold"
          >
            ذخیره تنظیمات
          </button>
        </div>
      </form>
    </div>
  );
}

// ============================================================================
// ۶. مودال مشاهده نامه رسمی، گردش ارجاعات و بارگذاری نسخه ویرایش‌شده Word
// ============================================================================
function LetterDetailModal({
  letter,
  orgSettings,
  onClose,
  onRefer,
  onUpdateStatus,
  onExportWord,
  onUploadNewWordVersion
}) {
  const [activeSubTab, setActiveSubTab] = useState('paper');
  const [selectedTargets, setSelectedTargets] = useState(['expert']);
  const [referralType, setReferralType] = useState('جهت اقدام');
  const [deadline, setDeadline] = useState('');
  const [instructions, setInstructions] = useState('');

  const toggleTarget = (roleId) => {
    setSelectedTargets((prev) =>
      prev.includes(roleId) ? prev.filter((r) => r !== roleId) : [...prev, roleId]
    );
  };

  const handleSendReferral = (e) => {
    e.preventDefault();
    if (selectedTargets.length === 0) return;
    const targets = selectedTargets.map((id) => {
      const roleObj = SECRETARIAT_ROLES.find((r) => r.id === id);
      return { roleId: id, label: roleObj?.userDisplayName || id };
    });
    onRefer({ targets, referralType, deadline, instructions });
    setInstructions('');
  };

  const handleWordReupload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUploadNewWordVersion({
        id: 'att-' + Date.now(),
        name: file.name,
        size: `${Math.max(1, Math.round(file.size / 1024))} KB`,
        type: file.type,
        dataUrl: reader.result,
        date: getTodayJalali()
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto">
        <div className="p-4 sm:p-5 bg-[#0b1f3a] text-white flex flex-wrap items-center justify-between gap-3 no-print">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-blue-600 px-3 py-1 rounded-lg font-bold">
              {toPersianDigits(letter.indicatorNumber || 'پیش‌نویس')}
            </span>
            <h3 className="font-bold text-sm sm:text-base line-clamp-1">{letter.subject}</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onExportWord}
              className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>دانلود Word (.docx)</span>
            </button>
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>چاپ / PDF</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-2 gap-2 no-print">
          {[
            { id: 'paper', label: 'متن و سربرگ رسمی نامه' },
            { id: 'workflow', label: `ارجاع و گردش کار (${toPersianDigits(letter.referrals?.length || 0)})` },
            { id: 'versions', label: `نسخه‌های Word و پیوست‌ها (${toPersianDigits(letter.versions?.length || 0)})` }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveSubTab(t.id)}
              className={`px-4 py-2 rounded-t-xl text-xs font-bold ${
                activeSubTab === t.id
                  ? 'bg-white text-blue-800 border-t border-x border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6 max-h-[75vh] overflow-y-auto">
          {activeSubTab === 'paper' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs no-print">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500">تغییر وضعیت نامه:</span>
                  <select
                    value={letter.status}
                    onChange={(e) => onUpdateStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
                  >
                    {INCOMING_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                    <option value="ارسال‌شده">ارسال‌شده</option>
                  </select>
                </div>
                <span className="text-slate-500">
                  مسئول فعلی: <b>{letter.assignedToName}</b>
                </span>
              </div>

              <OfficialLetterPaper letter={letter} settings={orgSettings} />
            </div>
          )}

          {activeSubTab === 'workflow' && (
            <div className="space-y-6">
              <form onSubmit={handleSendReferral} className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4 text-xs">
                <h4 className="font-bold text-blue-950 text-sm">ارجاع نامه به اشخاص یا واحدهای سازمانی</h4>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1.5">
                    انتخاب گیرندگان ارجاع (امکان انتخاب هم‌زمان چند نفر):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {SECRETARIAT_ROLES.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => toggleTarget(r.id)}
                        className={`px-3 py-1.5 rounded-xl border font-semibold transition-all ${
                          selectedTargets.includes(r.id)
                            ? 'bg-[#0f294a] text-white border-[#0f294a]'
                            : 'bg-white text-slate-700 border-slate-300'
                        }`}
                      >
                        {r.userDisplayName}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">نوع ارجاع</label>
                    <select
                      value={referralType}
                      onChange={(e) => setReferralType(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    >
                      {REFERRAL_TYPES.map((rt) => (
                        <option key={rt} value={rt}>
                          {rt}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">مهلت اقدام (شمسی)</label>
                    <input
                      type="text"
                      dir="ltr"
                      placeholder="1405/02/05"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">توضیحات و هامش ارجاع</label>
                  <input
                    type="text"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="دستورالعمل بررسی یا تهیه پاسخ را بنویسید..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                  >
                    ثبت و ارسال ارجاع
                  </button>
                </div>
              </form>

              <div className="space-y-2.5">
                <h4 className="font-bold text-xs text-slate-700">سوابق گردش و ارجاعات قبلی:</h4>
                {(letter.referrals || []).length === 0 ? (
                  <p className="text-xs text-slate-400">هنوز ارجاعی ثبت نشده است.</p>
                ) : (
                  letter.referrals.map((ref) => (
                    <div key={ref.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <div className="flex justify-between text-slate-500 mb-1">
                        <span>
                          <b>{ref.fromUser}</b> ⟵ <b>{ref.toName}</b> ({ref.referralType})
                        </span>
                        <span dir="ltr">{toPersianDigits(ref.date)}</span>
                      </div>
                      <p className="text-slate-800">{ref.instructions}</p>
                      {ref.response && (
                        <p className="text-emerald-700 font-bold mt-1">پاسخ: {ref.response}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeSubTab === 'versions' && (
            <div className="space-y-5 text-xs">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-indigo-950 text-sm">
                    ویرایش در Microsoft Word و بارگذاری نسخه نهایی
                  </h4>
                  <p className="text-indigo-800 mt-0.5">
                    می‌توانید فایل DOCX را دانلود کرده، در Word ویرایش کنید و نسخه نهایی را مجدداً اینجا بارگذاری نمایید.
                  </p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer flex items-center gap-1.5">
                  <Upload className="w-4 h-4" />
                  <span>بارگذاری نسخه نهایی Word</span>
                  <input
                    type="file"
                    accept=".doc,.docx,.pdf"
                    onChange={handleWordReupload}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-2">تاریخچه نسخه‌های نامه:</h4>
                <div className="space-y-2">
                  {(letter.versions || []).map((v, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between">
                      <span>
                        <b>نسخه {toPersianDigits(v.version)}:</b> {v.note} ({v.user})
                      </span>
                      <span dir="ltr" className="text-slate-400">
                        {toPersianDigits(v.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {(letter.attachments || []).length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">فایل‌های پیوست و نسخه‌های بارگذاری‌شده:</h4>
                  <div className="space-y-2">
                    {letter.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl bg-white border border-slate-200 flex items-center justify-between"
                      >
                        <span className="font-bold text-slate-800">{att.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">{att.size}</span>
                          {att.dataUrl && (
                            <a
                              href={att.dataUrl}
                              download={att.name}
                              className="text-blue-600 font-bold hover:underline"
                            >
                              دانلود فایل
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfficialLetterPaper({ letter, settings }) {
  return (
    <div className="bg-white border border-slate-300 rounded-xl p-8 sm:p-12 shadow-sm max-w-3xl mx-auto text-slate-900">
      <div className="text-center border-b-2 border-[#0f294a] pb-4 mb-6">
        <p className="text-xs font-bold mb-1">بسمه تعالی</p>
        <h3 className="text-sm font-extrabold text-[#0f294a]">
          {settings?.orgHeaderTitle || 'معاونت علمی، فناوری و اقتصاد دانش‌بنیان ریاست جمهوری'}
        </h3>
        <p className="text-xs font-bold text-blue-700 mt-0.5">
          {settings?.orgSubTitle || 'پارک فناوری پردیس — مرکز رشد فناوری نخبگان'}
        </p>
      </div>

      <div className="flex justify-between items-start text-xs mb-8">
        <div className="space-y-1">
          <p>
            <span className="text-slate-500">طبقه‌بندی: </span>
            <b>{letter.confidentiality || 'عادی'}</b>
          </p>
          <p>
            <span className="text-slate-500">فوریت: </span>
            <b>{letter.priority || 'عادی'}</b>
          </p>
        </div>
        <div className="space-y-1 text-left">
          <p>
            <span className="text-slate-500">شماره نامه: </span>
            <b className="font-mono">{toPersianDigits(letter.indicatorNumber || 'پیش‌نویس')}</b>
          </p>
          <p>
            <span className="text-slate-500">تاریخ: </span>
            <b>{toPersianDigits(letter.letterDate)}</b>
          </p>
          <p>
            <span className="text-slate-500">پیوست: </span>
            <b>{letter.attachments?.length ? `${toPersianDigits(letter.attachments.length)} فقره` : 'ندارد'}</b>
          </p>
        </div>
      </div>

      <div className="space-y-2 text-sm font-bold mb-6">
        <p>
          {letter.type === 'incoming'
            ? `فرستنده: ${letter.senderName || ''} (${letter.senderOrg || ''})`
            : `گیرنده محترم: ${letter.recipientName || ''} ${letter.recipientOrg ? `(${letter.recipientOrg})` : ''}`}
        </p>
        <p>موضوع: {letter.subject}</p>
      </div>

      <div className="text-sm leading-8 whitespace-pre-line text-justify min-h-[180px] mb-10">
        {letter.body}
      </div>

      <div className="flex justify-end mb-8">
        <div className="text-center text-sm">
          <p className="font-extrabold">{letter.signerName || 'دکتر حمیدرضا رضایی'}</p>
          <p className="text-xs text-slate-600 mt-1">{letter.signerTitle || 'رئیس مرکز رشد فناوری نخبگان'}</p>
        </div>
      </div>

      {letter.ccList && letter.ccList.length > 0 && (
        <div className="border-t border-slate-200 pt-3 text-xs text-slate-600">
          <p className="font-bold mb-1">رونوشت:</p>
          <ul className="list-disc pr-5 space-y-0.5">
            {letter.ccList.map((cc, i) => (
              <li key={i}>{cc}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// ۷. کامپوننت‌های پورتال و مدیریت شرکت‌ها
// ============================================================================
function PublicDirectoryView({ companies, stats, onSelectCompany }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedField, setSelectedField] = useState('همه');
  const [selectedLevel, setSelectedLevel] = useState('همه');
  const [selectedStatus, setSelectedStatus] = useState('همه');
  const [selectedKB, setSelectedKB] = useState('همه');
  const [selectedType, setSelectedType] = useState('همه');
  const [selectedLocation, setSelectedLocation] = useState('همه');
  const [sortBy, setSortBy] = useState('newest');
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

  const featuredCompanies = useMemo(() => publicCompanies.filter((c) => c.isFeatured), [publicCompanies]);

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
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
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900">{toPersianDigits(item.value)}</span>
              </div>
              <p className="text-xs font-medium text-slate-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

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
                className="bg-gradient-to-b from-white to-blue-50/40 rounded-2xl p-5 border border-blue-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <CompanyAvatar company={company} size="md" />
                    <div>
                      <span className="inline-block text-[11px] font-semibold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-md mb-1">
                        {company.field}
                      </span>
                      <h4 className="font-bold text-slate-900 group-hover:text-blue-700 line-clamp-1">
                        {company.name}
                      </h4>
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جست‌وجو بر اساس نام شرکت، محصول یا حوزه فناوری..."
                className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-300 focus:border-blue-600 outline-none text-sm"
              />
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium flex items-center gap-2 hover:bg-slate-50"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>فیلترهای پیشرفته</span>
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
              >
                <option value="newest">مرتب‌سازی: پیش‌فرض</option>
                <option value="name">بر اساس حروف الفبا</option>
                <option value="staff">بیشترین نیروی انسانی</option>
                <option value="products">بیشترین تعداد محصول</option>
              </select>
            </div>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {[
                { label: 'حوزه فعالیت', val: selectedField, set: setSelectedField, opts: filterOptions.fields },
                { label: 'سطح‌بندی شرکت', val: selectedLevel, set: setSelectedLevel, opts: filterOptions.levels },
                { label: 'وضعیت عضویت', val: selectedStatus, set: setSelectedStatus, opts: filterOptions.statuses },
                { label: 'دانش‌بنیان بودن', val: selectedKB, set: setSelectedKB, opts: filterOptions.kbs },
                { label: 'نوع شرکت', val: selectedType, set: setSelectedType, opts: filterOptions.types },
                { label: 'وضعیت استقرار', val: selectedLocation, set: setSelectedLocation, opts: filterOptions.locations }
              ].map((f, i) => (
                <div key={i}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">{f.label}</label>
                  <select
                    value={f.val}
                    onChange={(e) => f.set(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm bg-slate-50"
                  >
                    {f.opts.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button onClick={resetFilters} className="text-xs text-rose-600 font-medium flex items-center gap-1">
                  <X className="w-3.5 h-3.5" />
                  پاک کردن همه فیلترها
                </button>
              </div>
            </div>
          )}
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          فهرست شرکت‌ها و هسته‌های فناور ({toPersianDigits(filteredCompanies.length)} واحد)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => {
            const isKB =
              company.knowledgeBased &&
              company.knowledgeBased.includes('دانش‌بنیان') &&
              !company.knowledgeBased.includes('خیر');
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
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
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
                        className="font-bold text-slate-900 text-base group-hover:text-blue-700 cursor-pointer truncate"
                      >
                        {company.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 truncate">{company.field}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-6 line-clamp-3 mb-4 min-h-[4.5rem]">
                    {company.shortDesc}
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <span className="text-slate-400 block text-[11px]">سطح‌بندی</span>
                      <span className="font-semibold text-slate-700 truncate block">{company.level}</span>
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
                    className="px-3.5 py-1.5 rounded-lg bg-[#0f294a] hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>مشاهده شناسنامه شرکت</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CompanyProfileView({ company, accessPolicies, isAdmin, onBack, onEdit }) {
  if (!company) return null;
  const canShowInvestment = isAdmin || (accessPolicies.investmentData !== 'admin_only' && company.publishInvestment);
  const canShowSales = isAdmin || (accessPolicies.salesData !== 'admin_only' && company.publishSales);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
        <button
          onClick={onBack}
          className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-sm font-medium flex items-center gap-2"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست شرکت‌ها</span>
        </button>
        <div className="flex items-center gap-2.5">
          {isAdmin && (
            <button
              onClick={() => onEdit(company)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-sm font-semibold flex items-center gap-1.5"
            >
              <Edit className="w-4 h-4" />
              <span>ویرایش اطلاعات</span>
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl bg-[#0f294a] text-white text-sm font-semibold flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" />
            <span>دریافت PDF / چاپ</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-l from-[#0b1f3a] to-[#1e3a8a] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <CompanyAvatar company={company} size="lg" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold mb-1">{company.name}</h1>
            <p className="text-sky-200 text-sm">{company.field}</p>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0f294a] mb-3">معرفی عمومی و اطلاعات ارتباطی</h2>
          <p className="text-sm text-slate-700 leading-7 mb-5">{company.shortDesc}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block">نوع شرکت</span>
              <b>{company.companyType || '—'}</b>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block">تاریخ تأسیس</span>
              <b>{toPersianDigits(company.establishedDate) || '—'}</b>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block">تلفن تماس</span>
              <b dir="ltr">{toPersianDigits(company.landline) || '—'}</b>
            </div>
            <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70">
              <span className="text-xs text-slate-500 block">ایمیل رسمی</span>
              <b className="text-xs">{company.email || '—'}</b>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#0f294a] mb-4">محصولات و خدمات</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(company.products || []).map((prod, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60">
                <h3 className="font-bold text-sm text-slate-900">{prod.name}</h3>
                {prod.brand && <span className="text-xs text-blue-700 block mb-1">برند: {prod.brand}</span>}
                <p className="text-xs text-slate-600 leading-6">{prod.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-bold text-[#0f294a] mb-3">اطلاعات کسب‌وکار</h3>
            <p className="mb-1">مدل درآمدی: <b>{company.revenueModel || '—'}</b></p>
            <p className="mb-1">مخاطبان: <b>{company.targetAudience || '—'}</b></p>
            {canShowInvestment && company.investmentAmount && (
              <p className="text-emerald-700">سرمایه‌گذاری جذب‌شده: <b>{toPersianDigits(company.investmentAmount)}</b></p>
            )}
            {canShowSales && company.salesYear1 && (
              <p className="text-blue-700 mt-1">فروش سال اول: <b>{toPersianDigits(company.salesYear1)}</b></p>
            )}
          </div>
          <div>
            <h3 className="font-bold text-[#0f294a] mb-3">سرمایه انسانی</h3>
            <p className="mb-1">کل نیروی انسانی: <b>{toPersianDigits(company.totalStaff || 0)} نفر</b></p>
            <p className="mb-1">تعداد بانوان: <b>{toPersianDigits(company.femaleStaff || 0)} نفر</b></p>
            <p>نیروی ابتدای ورود: <b>{toPersianDigits(company.initialStaff || 0)} نفر</b></p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
          { label: 'مجموع محصولات ثبت‌شده', val: stats.totalProducts, color: 'border-amber-500' }
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
          <div className="space-y-3.5">
            {Object.entries(stats.byField).map(([field, count]) => (
              <div key={field}>
                <div className="flex justify-between text-xs font-medium mb-1">
                  <span>{field}</span>
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

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">شرکت‌های دارای عضویت رو به اتمام</h3>
            {stats.expiringCompanies.map((c) => (
              <div key={c.id} className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-3 mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
                  <p className="text-xs text-slate-600">پایان ۳ سال: {toPersianDigits(c.threeYearEndDate)}</p>
                </div>
                <button
                  onClick={() => onEditCompany(c)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-xs font-semibold"
                >
                  بررسی
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => onNavigateTab('excel')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              بارگذاری اکسل شرکت‌ها
            </button>
            <button
              onClick={() => onNavigateTab('form')}
              className="flex-1 py-2.5 px-4 rounded-xl bg-slate-100 text-slate-800 text-xs font-semibold"
            >
              ثبت دستی شرکت جدید
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminCompaniesListTab({
  companies,
  setCompanies,
  isSuperAdmin,
  onEdit,
  onViewPublic,
  showToast
}) {
  const [search, setSearch] = useState('');
  const filtered = companies.filter(
    (c) => !search || (c.name && c.name.includes(search)) || (c.nationalId && c.nationalId.includes(search))
  );

  const togglePublish = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isPublic: !c.isPublic } : c))
    );
    showToast('وضعیت انتشار عمومی به‌روزرسانی شد.');
  };

  const toggleFeatured = (id) => {
    setCompanies((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isFeatured: !c.isFeatured } : c))
    );
    showToast('وضعیت منتخب تغییر کرد.');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="جست‌وجو بر اساس نام شرکت یا شناسه ملی..."
          className="w-full max-w-md px-4 py-2 rounded-xl border border-slate-300 text-sm"
        />
        <span className="text-xs text-slate-500">{toPersianDigits(filtered.length)} رکورد</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead className="bg-slate-50 text-slate-600 text-xs border-b border-slate-200">
            <tr>
              <th className="py-3.5 px-4">نام شرکت / هسته</th>
              <th className="py-3.5 px-4">حوزه فعالیت</th>
              <th className="py-3.5 px-4 text-center">انتشار عمومی</th>
              <th className="py-3.5 px-4 text-center">منتخب</th>
              <th className="py-3.5 px-4 text-center">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/80">
                <td className="py-3.5 px-4 font-bold text-slate-900">{c.name}</td>
                <td className="py-3.5 px-4 text-xs text-slate-700">{c.field}</td>
                <td className="py-3.5 px-4 text-center">
                  <button
                    onClick={() => togglePublish(c.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      c.isPublic ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {c.isPublic ? 'منتشر شده' : 'پیش‌نویس'}
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <button onClick={() => toggleFeatured(c.id)}>
                    <Star className={`w-5 h-5 ${c.isFeatured ? 'text-amber-500 fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <div className="flex justify-center gap-1.5">
                    <button onClick={() => onViewPublic(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <FileText className="w-4 h-4" />
                    </button>
                    <button onClick={() => onEdit(c)} className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    {isSuperAdmin && (
                      <button
                        onClick={() => {
                          if (window.confirm(`حذف «${c.name}»؟`)) {
                            setCompanies((prev) => prev.filter((item) => item.id !== c.id));
                            showToast('شرکت حذف شد.');
                          }
                        }}
                        className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
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
    </div>
  );
}

function AdminCompanyFormTab({ editingCompany, companies, setCompanies, onDone, showToast }) {
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
  const updateField = (k, v) => setFormData((p) => ({ ...p, [k]: v }));

  const handleSave = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('وارد کردن نام شرکت الزامی است.', 'error');
      return;
    }
    if (editingCompany) {
      setCompanies((prev) => prev.map((c) => (c.id === editingCompany.id ? formData : c)));
      showToast('اطلاعات شرکت به‌روزرسانی شد.');
    } else {
      setCompanies((prev) => [{ ...formData, id: 'comp-' + Date.now(), slug: generateSlug(formData.name) }, ...prev]);
      showToast('شرکت جدید ثبت شد.');
    }
    onDone();
  };

  const tabs = [
    { id: 1, title: '۱. هویتی و ثبتی' },
    { id: 2, title: '۲. مدیرعامل و هیئت‌مدیره' },
    { id: 3, title: '۳. استقرار و ارتباطی' },
    { id: 4, title: '۴. فناوری و محصولات' },
    { id: 5, title: '۵. نیروی انسانی' },
    { id: 6, title: '۶. اقتصادی و فروش' },
    { id: 7, title: '۷. عضویت و انتشار' }
  ];

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <h3 className="font-bold text-slate-900">
          {editingCompany ? `ویرایش: ${editingCompany.name}` : 'ثبت دستی شرکت جدید'}
        </h3>
        <div className="flex gap-2">
          <button type="button" onClick={onDone} className="px-4 py-2 rounded-xl border text-xs">
            انصراف
          </button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
            ذخیره اطلاعات
          </button>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-100/70 px-3 pt-2 gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFormTab(t.id)}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap ${
              formTab === t.id ? 'bg-white text-blue-800 border-t border-x border-slate-200' : 'text-slate-600'
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="p-6">
        {formTab === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold mb-1">نام شرکت / هسته فناور *</label>
              <input type="text" value={formData.name} onChange={(e) => updateField('name', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" required />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">شناسه ملی</label>
              <input type="text" dir="ltr" value={formData.nationalId} onChange={(e) => updateField('nationalId', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">وضعیت</label>
              <input type="text" value={formData.status} onChange={(e) => updateField('status', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">سطح‌بندی</label>
              <input type="text" value={formData.level} onChange={(e) => updateField('level', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">تاریخ تأسیس</label>
              <input type="text" dir="ltr" value={formData.establishedDate} onChange={(e) => updateField('establishedDate', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold mb-1">معرفی کوتاه</label>
              <textarea rows={3} value={formData.shortDesc} onChange={(e) => updateField('shortDesc', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">نام مدیرعامل</label>
              <input type="text" value={formData.ceoName} onChange={(e) => updateField('ceoName', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">شماره تماس مدیرعامل</label>
              <input type="text" dir="ltr" value={formData.ceoPhone} onChange={(e) => updateField('ceoPhone', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">کد ملی مدیرعامل</label>
              <input type="text" dir="ltr" value={formData.ceoNationalId} onChange={(e) => updateField('ceoNationalId', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">شماره واحد</label>
              <input type="text" value={formData.unitNumber} onChange={(e) => updateField('unitNumber', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">شماره ثابت</label>
              <input type="text" dir="ltr" value={formData.landline} onChange={(e) => updateField('landline', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">وبگاه</label>
              <input type="text" dir="ltr" value={formData.website} onChange={(e) => updateField('website', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 4 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">حوزه فعالیت</label>
              <input type="text" value={formData.field} onChange={(e) => updateField('field', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">وضعیت دانش‌بنیان</label>
              <input type="text" value={formData.knowledgeBased} onChange={(e) => updateField('knowledgeBased', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">کل نیروی انسانی</label>
              <input type="number" value={formData.totalStaff} onChange={(e) => updateField('totalStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">تعداد بانوان</label>
              <input type="number" value={formData.femaleStaff} onChange={(e) => updateField('femaleStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">نیروی ابتدای ورود</label>
              <input type="number" value={formData.initialStaff} onChange={(e) => updateField('initialStaff', Number(e.target.value))} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 6 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">مدل درآمدی</label>
              <input type="text" value={formData.revenueModel} onChange={(e) => updateField('revenueModel', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">میزان سرمایه‌گذاری</label>
              <input type="text" value={formData.investmentAmount} onChange={(e) => updateField('investmentAmount', e.target.value)} className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm" />
            </div>
          </div>
        )}
        {formTab === 7 && (
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.isPublic} onChange={(e) => updateField('isPublic', e.target.checked)} />
              <span>انتشار عمومی در وب‌سایت</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={formData.isFeatured} onChange={(e) => updateField('isFeatured', e.target.checked)} />
              <span>نمایش در شرکت‌های منتخب</span>
            </label>
          </div>
        )}
      </div>
    </form>
  );
}

function AdminExcelImportTab({ setCompanies, onDone, showToast }) {
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!window.XLSX) {
      showToast('کتابخانه اکسل در حال بارگذاری است، لطفاً چند ثانیه صبر کنید.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const wb = window.XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = window.XLSX.utils.sheet_to_json(ws, { defval: '' });
      if (!rows.length) return;
      const headers = Object.keys(rows[0]);
      setExcelHeaders(headers);
      setRawRows(rows);
      const autoMap = {};
      headers.forEach((h) => {
        const matched = DB_FIELD_DEFINITIONS.find((d) => d.aliases.some((a) => h.includes(a)));
        autoMap[h] = matched ? matched.key : '';
      });
      setColumnMapping(autoMap);
      showToast(`${toPersianDigits(rows.length)} ردیف خوانده شد.`);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = () => {
    const newItems = rawRows
      .map((r, idx) => {
        const obj = { id: 'comp-' + Date.now() + '-' + idx, isPublic: true, products: [] };
        Object.entries(columnMapping).forEach(([col, key]) => {
          if (key) obj[key] = r[col];
        });
        obj.slug = generateSlug(obj.name);
        return obj;
      })
      .filter((o) => o.name);
    setCompanies((prev) => [...newItems, ...prev]);
    showToast(`${toPersianDigits(newItems.length)} شرکت وارد پایگاه داده شد.`);
    onDone();
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
      <h3 className="font-bold text-base">بارگذاری گروهی شرکت‌ها از فایل اکسل (XLSX / XLS)</h3>
      <input type="file" accept=".xlsx,.xls" onChange={handleFileUpload} className="block text-xs" />
      {rawRows.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {excelHeaders.map((h) => (
              <div key={h} className="p-2 border rounded-xl">
                <span className="block font-bold mb-1">{h}</span>
                <select
                  value={columnMapping[h] || ''}
                  onChange={(e) => setColumnMapping((p) => ({ ...p, [h]: e.target.value }))}
                  className="w-full border rounded p-1"
                >
                  <option value="">نادیده گرفتن</option>
                  {DB_FIELD_DEFINITIONS.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          <button onClick={handleImport} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
            تأیید و ثبت در پایگاه داده
          </button>
        </div>
      )}
    </div>
  );
}

function AdminSettingsTab({
  setCompanies,
  isSuperAdmin,
  onBackupJson,
  onExportExcel,
  showToast
}) {
  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 space-y-5">
      <h3 className="font-bold text-base">تنظیمات دسترسی و پشتیبان‌گیری شرکت‌ها</h3>
      <div className="flex flex-wrap gap-3">
        <button onClick={onExportExcel} className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">
          خروجی اکسل شرکت‌ها
        </button>
        <button onClick={onBackupJson} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold">
          پشتیبان‌گیری JSON
        </button>
        {isSuperAdmin && (
          <button
            onClick={() => {
              if (window.confirm('حذف داده‌های آزمایشی؟')) {
                setCompanies([]);
                showToast('داده‌های آزمایشی پاک شدند.');
              }
            }}
            className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-bold"
          >
            حذف داده‌های آزمایشی
          </button>
        )}
      </div>
    </div>
  );
}
