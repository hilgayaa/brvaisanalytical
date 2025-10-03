import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (optional - be careful in production!)
  await prisma.inquiry.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('🗑️  Cleared existing data')

  // 1. CREATE CATEGORIES (Parent categories first)
  const categories = await Promise.all([
    // Root Categories
    prisma.category.create({
      data: {
        name: 'Microscopes',
        slug: 'microscopes',
        description: 'High-quality optical and digital microscopes for research and education',
        image: 'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400'
      }
    }),

    prisma.category.create({
      data: {
        name: 'Lab Equipment',
        slug: 'lab-equipment',
        description: 'Essential laboratory equipment and instruments',
        image: 'https://images.unsplash.com/photo-1582719378048-29d0ad4a5fa1?w=400'
      }
    }),

    prisma.category.create({
      data: {
        name: 'Analytical Instruments',
        slug: 'analytical-instruments',
        description: 'Precision instruments for chemical and biological analysis',
        image: 'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=400'
      }
    }),

    prisma.category.create({
      data: {
        name: 'Safety Equipment',
        slug: 'safety-equipment',
        description: 'Personal protective equipment and lab safety tools',
        image: 'https://images.unsplash.com/photo-1584434128309-4e5a8c8c6b9c?w=400'
      }
    }),

    prisma.category.create({
      data: {
        name: 'Heating & Cooling',
        slug: 'heating-cooling',
        description: 'Temperature control equipment for laboratory applications',
        image: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400'
      }
    })
  ])

  console.log(`✅ Created ${categories.length} main categories`)

  // 2. CREATE SUBCATEGORIES
  const subcategories = await Promise.all([
    // Microscope subcategories
    prisma.category.create({
      data: {
        name: 'Optical Microscopes',
        slug: 'optical-microscopes',
        description: 'Traditional light microscopes',
        parentId: categories[0].id
      }
    }),

    prisma.category.create({
      data: {
        name: 'Digital Microscopes',
        slug: 'digital-microscopes',
        description: 'Modern digital imaging microscopes',
        parentId: categories[0].id
      }
    }),

    // Lab Equipment subcategories
    prisma.category.create({
      data: {
        name: 'Centrifuges',
        slug: 'centrifuges',
        description: 'Laboratory centrifuges and rotors',
        parentId: categories[1].id
      }
    }),

    prisma.category.create({
      data: {
        name: 'Balances & Scales',
        slug: 'balances-scales',
        description: 'Precision weighing equipment',
        parentId: categories[1].id
      }
    })
  ])

  console.log(`✅ Created ${subcategories.length} subcategories`)

  // 3. CREATE PRODUCTS
  const products = await Promise.all([
    // Microscopes
    prisma.product.create({
      data: {
        name: 'Professional Compound Microscope BM-180',
        slug: 'professional-compound-microscope-bm-180',
        description: 'High-quality compound microscope with LED illumination, perfect for educational and research applications. Features precision optics and durable construction.',
        shortDesc: 'Professional compound microscope with LED illumination and precision optics',
        images: [
          'https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=600',
          'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600'
        ],
        specifications: {
          magnification: '40x-1000x',
          objectiveLenses: '4x, 10x, 40x, 100x',
          eyepieces: '10x wide field',
          illumination: 'LED',
          focusingSystem: 'Coarse and fine adjustment'
        },
        features: [
          'LED illumination system',
          'Precision coarse and fine focusing',
          'High-quality optical glass lenses',
          'Durable metal construction',
          'Carrying case included'
        ],
        categoryId: subcategories[0].id, // Optical Microscopes
        brand: 'LabTech',
        model: 'BM-180',
        price: 1299.99,
        currency: 'USD',
        inStock: true,
        featured: true
      }
    }),

    prisma.product.create({
      data: {
        name: 'Digital USB Microscope DM-500',
        slug: 'digital-usb-microscope-dm-500',
        description: 'Advanced digital microscope with USB connectivity and high-resolution camera. Ideal for digital documentation and live observation.',
        shortDesc: 'Digital USB microscope with high-resolution camera and software',
        images: [
          'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=600'
        ],
        specifications: {
          magnification: '50x-500x digital zoom',
          resolution: '5MP camera',
          connectivity: 'USB 2.0',
          compatibility: 'Windows, Mac, Linux',
          software: 'Professional imaging software included'
        },
        features: [
          '5MP high-resolution camera',
          'Real-time live preview',
          'Image and video capture',
          'Measurement tools',
          'Professional software included'
        ],
        categoryId: subcategories[1].id, // Digital Microscopes
        brand: 'DigiScope',
        model: 'DM-500',
        price: 899.99,
        currency: 'USD',
        inStock: true,
        featured: true
      }
    }),

    // Lab Equipment
    prisma.product.create({
      data: {
        name: 'High-Speed Centrifuge CF-800',
        slug: 'high-speed-centrifuge-cf-800',
        description: 'Reliable high-speed centrifuge with digital display and multiple rotor options. Perfect for sample preparation and separation.',
        shortDesc: 'High-speed centrifuge with digital display and safety features',
        images: [
          'https://images.unsplash.com/photo-1582719378048-29d0ad4a5fa1?w=600'
        ],
        specifications: {
          maxSpeed: '15,000 RPM',
          capacity: '24 x 1.5ml tubes',
          display: 'Digital LCD',
          timer: '1-99 minutes',
          safety: 'Automatic rotor recognition'
        },
        features: [
          'High-speed operation up to 15,000 RPM',
          'Digital display and controls',
          'Safety lid lock system',
          'Low noise operation',
          'Multiple rotor options available'
        ],
        categoryId: subcategories[2].id, // Centrifuges
        brand: 'CentriMax',
        model: 'CF-800',
        price: 2499.99,
        currency: 'USD',
        inStock: true,
        featured: false
      }
    }),

    prisma.product.create({
      data: {
        name: 'Analytical Balance AB-220',
        slug: 'analytical-balance-ab-220',
        description: 'Precision analytical balance with 0.1mg readability. Essential for accurate weighing in analytical laboratories.',
        shortDesc: 'High-precision analytical balance with 0.1mg readability',
        images: [
          'https://images.unsplash.com/photo-1576319155264-99536e0be1ee?w=600'
        ],
        specifications: {
          capacity: '220g',
          readability: '0.1mg',
          repeatability: '0.1mg',
          linearityError: '±0.2mg',
          calibration: 'External'
        },
        features: [
          'High precision 0.1mg readability',
          'Draft shield included',
          'Multiple weighing units',
          'Data logging capability',
          'RS-232 interface'
        ],
        categoryId: subcategories[3].id, // Balances & Scales
        brand: 'PreciScale',
        model: 'AB-220',
        price: 1899.99,
        currency: 'USD',
        inStock: true,
        featured: true
      }
    }),

    // Analytical Instruments
    prisma.product.create({
      data: {
        name: 'UV-Vis Spectrophotometer SP-2000',
        slug: 'uv-vis-spectrophotometer-sp-2000',
        description: 'Double-beam UV-Visible spectrophotometer for quantitative analysis. Features high accuracy and user-friendly software.',
        shortDesc: 'Double-beam UV-Vis spectrophotometer with advanced software',
        images: [
          'https://via.placeholder.com/600x400/4F46E5/FFFFFF?text=UV-Vis+Spectrophotometer'
        ],
        specifications: {
          wavelengthRange: '190-1100nm',
          spectralBandwidth: '2nm',
          wavelengthAccuracy: '±1nm',
          photometricAccuracy: '±0.005A',
          detector: 'Silicon photodiode'
        },
        features: [
          'Double-beam optical system',
          'High-resolution color display',
          'Advanced analysis software',
          'Multiple measurement modes',
          'Data export capabilities'
        ],
        categoryId: categories[2].id, // Analytical Instruments
        brand: 'SpectraLab',
        model: 'SP-2000',
        price: 8999.99,
        currency: 'USD',
        inStock: false,
        featured: true
      }
    }),

    // Safety Equipment
    prisma.product.create({
      data: {
        name: 'Laboratory Safety Cabinet LSC-48',
        slug: 'laboratory-safety-cabinet-lsc-48',
        description: 'Class II biological safety cabinet with HEPA filtration. Provides personnel and product protection.',
        shortDesc: 'Class II biosafety cabinet with HEPA filtration system',
        images: [
          'https://via.placeholder.com/600x400/059669/FFFFFF?text=Safety+Cabinet'
        ],
        specifications: {
          class: 'Class II, Type A2',
          workArea: '48 inches',
          filtration: 'HEPA 99.99%',
          airflow: '105 FPM',
          noise: '<67 dB'
        },
        features: [
          'HEPA filtration system',
          'UV sterilization lamp',
          'Digital airflow display',
          'Audio/visual alarms',
          'Energy efficient design'
        ],
        categoryId: categories[3].id, // Safety Equipment
        brand: 'SafeLab',
        model: 'LSC-48',
        price: 12499.99,
        currency: 'USD',
        inStock: true,
        featured: false
      }
    }),

    // Heating & Cooling
    prisma.product.create({
      data: {
        name: 'Laboratory Incubator INC-75',
        slug: 'laboratory-incubator-inc-75',
        description: 'Precision laboratory incubator with uniform temperature distribution. Ideal for cell culture and microbiology.',
        shortDesc: 'Precision lab incubator with digital temperature control',
        images: [
          'https://via.placeholder.com/600x400/DC2626/FFFFFF?text=Laboratory+Incubator'
        ],
        specifications: {
          capacity: '75 liters',
          temperatureRange: 'Ambient +5°C to 80°C',
          accuracy: '±0.1°C',
          uniformity: '±0.3°C',
          display: 'Digital LED'
        },
        features: [
          'Precise temperature control',
          'Uniform heat distribution',
          'Digital display and controls',
          'Over-temperature protection',
          'Stainless steel interior'
        ],
        categoryId: categories[4].id, // Heating & Cooling
        brand: 'ThermoLab',
        model: 'INC-75',
        price: 1799.99,
        currency: 'USD',
        inStock: true,
        featured: false
      }
    }),

    // Additional products for better catalog
    prisma.product.create({
      data: {
        name: 'Laboratory Hot Plate Stirrer HPS-300',
        slug: 'laboratory-hot-plate-stirrer-hps-300',
        description: 'Digital hot plate magnetic stirrer with ceramic heating surface. Perfect for heating and mixing applications.',
        shortDesc: 'Digital hot plate stirrer with ceramic heating surface',
        images: [
          'https://via.placeholder.com/600x400/7C3AED/FFFFFF?text=Hot+Plate+Stirrer'
        ],
        specifications: {
          heatingTemp: '50°C to 300°C',
          stirringSpeed: '100-1500 RPM',
          plateSize: '180 x 180mm',
          material: 'Ceramic heating surface',
          display: 'Digital LED'
        },
        features: [
          'Ceramic heating surface',
          'Digital temperature display',
          'Variable stirring speed',
          'Over-temperature protection',
          'Chemical resistant coating'
        ],
        categoryId: categories[4].id, // Heating & Cooling
        brand: 'HeatMix',
        model: 'HPS-300',
        price: 699.99,
        currency: 'USD',
        inStock: true,
        featured: false
      }
    })
  ])

  console.log(`✅ Created ${products.length} products`)

  // 4. CREATE SAMPLE INQUIRIES
  const inquiries = await Promise.all([
    prisma.inquiry.create({
      data: {
        productId: products[0].id,
        name: 'Dr. Sarah Johnson',
        email: 'sarah.johnson@university.edu',
        company: 'State University Biology Dept',
        phone: '+1-555-0123',
        message: 'I am interested in purchasing 5 units of this microscope for our undergraduate biology lab. Could you provide bulk pricing and delivery timeline?',
        status: 'PENDING'
      }
    }),

    prisma.inquiry.create({
      data: {
        productId: products[3].id,
        name: 'Mike Chen',
        email: 'mike.chen@researchlab.com',
        company: 'BioResearch Labs Inc',
        phone: '+1-555-0456',
        message: 'We need a high-precision balance for our analytical chemistry work. Does this model come with calibration certificate?',
        status: 'RESPONDED'
      }
    })
  ])

  console.log(`✅ Created ${inquiries.length} sample inquiries`)

  console.log('\n🎉 Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`   Categories: ${categories.length + subcategories.length}`)
  console.log(`   Products: ${products.length}`)
  console.log(`   Inquiries: ${inquiries.length}`)
  console.log('\n🚀 Your lab equipment store is ready!')
}

// main()
//   .catch((e) => {
//     console.error('❌ Error during seeding:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })