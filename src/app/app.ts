import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';
import {
  CommerceStore,
  Order,
  Product,
  ProductCategory,
  PurchaseCadence,
} from './commerce-store';

export type WorkspaceView =
  | 'storefront'
  | 'console'
  | 'catalog'
  | 'orders'
  | 'pricing';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  readonly store = inject(CommerceStore);

  // Navigation & Primary View State
  readonly activeView = signal<WorkspaceView>('storefront');

  // Storefront Filter & Pricing Mode State (placed in workspace toolbar below header)
  readonly selectedCategory = signal<'All' | ProductCategory>('All');
  readonly searchQuery = signal<string>('');
  readonly sortBy = signal<'featured' | 'price-asc' | 'price-desc'>('featured');
  readonly b2bPricingMode = signal<boolean>(false);

  // Contiguous Purchase Module (PDP) State
  readonly activeProduct = signal<Product>(this.store.products()[0]);
  readonly selectedFinish = signal<string>(this.store.products()[0].finishes[0]);
  readonly selectedCadence = signal<PurchaseCadence>('one-time');
  readonly pdpQuantity = signal<number>(1);
  readonly pdpModalOpen = signal<boolean>(false);

  // Slide-over Cart & Checkout State
  readonly cartDrawerOpen = signal<boolean>(false);
  readonly checkoutStep = signal<'bag' | 'checkout' | 'confirmed'>('bag');
  readonly lastConfirmedOrder = signal<Order | null>(null);
  readonly promoFeedback = signal<string>('');

  // Toast Notification Banner
  readonly toastMessage = signal<string>('');

  // Merchant Console & SaaS State
  readonly orderFilter = signal<'All' | 'Processing' | 'Fulfilled' | 'Net-30 Pending'>('All');
  readonly orderSearch = signal<string>('');
  readonly catalogSearch = signal<string>('');
  readonly showNewProductModal = signal<boolean>(false);
  readonly annualBilling = signal<boolean>(true);
  readonly selectedSaasTierId = signal<string>('tier-atelier');
  readonly simulatedMonthlyGmv = signal<number>(85000);

  // Interactive Mechanism-to-Outcome Simulator in Merchant Console
  readonly activeMechanismTab = signal<'b2b-net30' | 'replenishment' | 'multi-node'>('b2b-net30');

  // Reactive Forms (No ngModel per strict Angular guidelines)
  readonly searchControl = new FormControl('', {nonNullable: true});
  readonly promoControl = new FormControl('', {nonNullable: true});
  readonly orderSearchControl = new FormControl('', {nonNullable: true});
  readonly catalogSearchControl = new FormControl('', {nonNullable: true});

  readonly checkoutForm = new FormGroup({
    customerName: new FormControl('Henrik Lindqvist', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
    organization: new FormControl('Atelier Lindqvist & Partners', {
      nonNullable: true,
    }),
    email: new FormControl('procurement@atelier-lindqvist.se', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    phone: new FormControl('+46 8 501 24 00', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shippingAddress: new FormControl('Strandvägen 7A, 114 56', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    shippingCity: new FormControl('Stockholm, SE', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    paymentMethod: new FormControl<
      'Corporate Net-30' | 'Card Ending 4819' | 'Cash on Delivery'
    >('Corporate Net-30', {nonNullable: true}),
  });

  readonly newProductForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)],
    }),
    sku: new FormControl('VL-502-BR', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    category: new FormControl<ProductCategory>('Lighting', {
      nonNullable: true,
    }),
    subtitle: new FormControl(
      'Precision architectural fixture machined from solid brass and honed stone',
      {
        nonNullable: true,
        validators: [Validators.required],
      }
    ),
    retailPrice: new FormControl(520, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(25)],
    }),
    stockCount: new FormControl(24, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    materials: new FormControl('C36000 Solid Brass, Roman Travertine', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    this.searchControl.valueChanges.subscribe((val) => {
      this.searchQuery.set(val);
    });
    this.orderSearchControl.valueChanges.subscribe((val) => {
      this.orderSearch.set(val);
    });
    this.catalogSearchControl.valueChanges.subscribe((val) => {
      this.catalogSearch.set(val);
    });
  }

  // Computed Filtered Products for Storefront
  readonly filteredProducts = computed(() => {
    const category = this.selectedCategory();
    const query = this.searchQuery().trim().toLowerCase();
    const sort = this.sortBy();

    const list = this.store.products().filter((p) => {
      const matchesCat = category === 'All' || p.category === category;
      const matchesQuery =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.subtitle.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.materials.toLowerCase().includes(query);
      return matchesCat && matchesQuery;
    });

    if (sort === 'price-asc') {
      return [...list].sort((a, b) => a.retailPrice - b.retailPrice);
    }
    if (sort === 'price-desc') {
      return [...list].sort((a, b) => b.retailPrice - a.retailPrice);
    }
    return list;
  });

  // Computed Filtered Products for Merchant Catalog View
  readonly filteredCatalog = computed(() => {
    const query = this.catalogSearch().trim().toLowerCase();
    return this.store.products().filter(
      (p) =>
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  });

  // Computed Filtered Orders for Merchant Order Queue
  readonly filteredOrders = computed(() => {
    const status = this.orderFilter();
    const query = this.orderSearch().trim().toLowerCase();

    return this.store.orders().filter((o) => {
      const matchesStatus = status === 'All' || o.status === status;
      const matchesQuery =
        !query ||
        o.id.toLowerCase().includes(query) ||
        o.customerName.toLowerCase().includes(query) ||
        o.organization.toLowerCase().includes(query) ||
        o.shippingCity.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  });

  // Computed Active Product Unit Price in Contiguous Purchase Module
  readonly activeProductUnitPrice = computed(() =>
    this.store.calculateUnitPrice(
      this.activeProduct(),
      this.selectedCadence(),
      this.b2bPricingMode()
    )
  );

  // Computed Free Shipping Remaining
  readonly freeShippingRemaining = computed(() => {
    const net = this.store.cartSubtotal() - this.store.discountAmount();
    return Math.max(0, this.store.freeShippingThreshold - net);
  });

  readonly freeShippingProgressPct = computed(() => {
    const net = this.store.cartSubtotal() - this.store.discountAmount();
    return Math.min(100, Math.round((net / this.store.freeShippingThreshold) * 100));
  });

  // Computed SaaS Fee Savings Calculator
  readonly annualFeeSavings = computed(() => {
    const gmv = this.simulatedMonthlyGmv();
    // Comparing legacy 2.9% platform fee vs Vellum Atelier 0.5% fee
    const legacyFee = gmv * 0.029;
    const vellumFee = gmv * 0.005;
    return Math.round((legacyFee - vellumFee) * 12);
  });

  setView(view: WorkspaceView, event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.activeView.set(view);
  }

  setCategory(cat: 'All' | ProductCategory): void {
    this.selectedCategory.set(cat);
  }

  setSort(sort: 'featured' | 'price-asc' | 'price-desc'): void {
    this.sortBy.set(sort);
  }

  toggleB2bMode(b2b: boolean): void {
    this.b2bPricingMode.set(b2b);
    if (b2b) {
      this.selectedCadence.set('b2b-pack');
      this.showToast('Switched to B2B Trade Wholesale pricing (20% trade discount active)');
    } else {
      this.selectedCadence.set('one-time');
      this.showToast('Switched to Direct-to-Consumer Standard Retail pricing');
    }
  }

  inspectProduct(product: Product, openModal = false): void {
    this.activeProduct.set(product);
    this.selectedFinish.set(product.finishes[0]);
    this.selectedCadence.set(this.b2bPricingMode() ? 'b2b-pack' : 'one-time');
    this.pdpQuantity.set(1);
    if (openModal) {
      this.pdpModalOpen.set(true);
    }
  }

  closePdpModal(): void {
    this.pdpModalOpen.set(false);
  }

  adjustPdpQuantity(delta: number): void {
    this.pdpQuantity.update((q) => Math.max(1, q + delta));
  }

  quickAddToCart(product: Product, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    const finish = product.finishes[0];
    const cadence: PurchaseCadence = this.b2bPricingMode() ? 'b2b-pack' : 'one-time';
    this.store.addToCart(product, finish, cadence, 1, this.b2bPricingMode());
    this.showToast(`Added 1× ${product.name} (${finish}) to Bag`);
  }

  addConfiguredProductToCart(): void {
    const product = this.activeProduct();
    const finish = this.selectedFinish();
    const cadence = this.selectedCadence();
    const qty = this.pdpQuantity();

    this.store.addToCart(product, finish, cadence, qty, this.b2bPricingMode());
    this.pdpModalOpen.set(false);
    this.checkoutStep.set('bag');
    this.cartDrawerOpen.set(true);
    this.showToast(`Added ${qty}× ${product.name} (${finish}) to Bag`);
  }

  openCartDrawer(): void {
    if (this.checkoutStep() === 'confirmed' && this.store.cartCount() > 0) {
      this.checkoutStep.set('bag');
    }
    this.cartDrawerOpen.set(true);
  }

  closeCartDrawer(): void {
    this.cartDrawerOpen.set(false);
  }

  applyPromo(): void {
    const raw = this.promoControl.value;
    if (!raw.trim()) {
      this.promoFeedback.set('Enter code VELLUM15 or TRADE20');
      return;
    }
    const ok = this.store.applyPromoCode(raw);
    if (ok) {
      this.promoFeedback.set(`Code ${raw.toUpperCase()} applied (-${this.store.promoDiscountPct()}%)`);
    } else {
      this.promoFeedback.set('Invalid code. Try VELLUM15 or TRADE20');
    }
  }

  proceedToCheckout(): void {
    if (this.store.cartCount() === 0) return;
    this.checkoutStep.set('checkout');
  }

  backToBag(): void {
    this.checkoutStep.set('bag');
  }

  completeOrder(): void {
    if (this.checkoutForm.invalid || this.store.cartCount() === 0) {
      this.checkoutForm.markAllAsTouched();
      return;
    }
    const val = this.checkoutForm.getRawValue();
    const created = this.store.submitOrder({
      customerName: val.customerName,
      organization: val.organization,
      email: val.email,
      shippingCity: val.shippingCity,
      paymentMethod: val.paymentMethod,
      b2bMode: this.b2bPricingMode(),
    });
    this.lastConfirmedOrder.set(created);
    this.checkoutStep.set('confirmed');
    this.showToast(`Order #${created.id} confirmed and synced to Merchant Console`);
  }

  viewConfirmedOrderInConsole(): void {
    this.cartDrawerOpen.set(false);
    this.checkoutStep.set('bag');
    this.activeView.set('orders');
  }

  submitNewProduct(): void {
    if (this.newProductForm.invalid) {
      this.newProductForm.markAllAsTouched();
      return;
    }
    const raw = this.newProductForm.getRawValue();
    const created = this.store.createNewProduct({
      name: raw.name,
      sku: raw.sku,
      category: raw.category,
      subtitle: raw.subtitle,
      retailPrice: Number(raw.retailPrice),
      stockCount: Number(raw.stockCount),
      materials: raw.materials,
    });
    this.showNewProductModal.set(false);
    this.newProductForm.reset({
      name: '',
      sku: `VL-50${this.store.products().length + 2}-BR`,
      category: 'Lighting',
      subtitle: 'Precision architectural fixture machined from solid brass and honed stone',
      retailPrice: 520,
      stockCount: 24,
      materials: 'C36000 Solid Brass, Roman Travertine',
    });
    this.activeProduct.set(created);
    this.showToast(`Published ${created.name} (${created.sku}) to live storefront`);
  }

  setSimulatedGmv(amount: number): void {
    this.simulatedMonthlyGmv.set(amount);
  }

  selectSaasTier(tierId: string, tierName: string): void {
    this.selectedSaasTierId.set(tierId);
    this.showToast(`Selected ${tierName} for your workspace`);
  }

  clearStorefrontFilters(): void {
    this.selectedCategory.set('All');
    this.searchControl.setValue('');
    this.sortBy.set('featured');
  }

  private showToast(msg: string): void {
    this.toastMessage.set(msg);
    setTimeout(() => {
      if (this.toastMessage() === msg) {
        this.toastMessage.set('');
      }
    }, 3600);
  }
}
