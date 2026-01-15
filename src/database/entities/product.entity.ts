import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Category } from './category.entity';
import { Store } from './store.entity';
import { SaleItem } from './sale-item.entity';

@Entity('products')
@Index(['tenantId', 'barcode'], { unique: true, where: 'barcode IS NOT NULL' })
@Index(['tenantId', 'sku'], { unique: true, where: 'sku IS NOT NULL' })
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, unique: false })
  barcode: string;

  @Column({ nullable: true, unique: false })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPrice: number;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'uuid' })
  tenantId: string;

  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenantId' })
  tenant: Tenant;

  @Column({ type: 'uuid', nullable: true })
  storeId: string;

  @ManyToOne(() => Store, { nullable: true })
  @JoinColumn({ name: 'storeId' })
  store: Store;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isAddonItem: boolean;

  @Column({ nullable: true })
  availability: string;

  @Column({ nullable: true })
  sort: number;

  @Column({ type: 'text', nullable: true })
  allergyNotes: string;

  @Column({ type: 'simple-array', nullable: true })
  ingredientIds: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  percentageDiscount: number;

  @Column({ type: 'simple-array', nullable: true })
  productSizes: string[];

  @Column({ type: 'uuid', nullable: true })
  deliveryRateId: string;

  @Column({ type: 'uuid', nullable: true })
  riderId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => SaleItem, (saleItem) => saleItem.product)
  saleItems: SaleItem[];
}
