export type Language = 'tr' | 'en';

export interface Translations {
  // Brand
  brandName: string;
  brandTag: string;

  // Categories
  categories: {
    linear: string;
    tree: string;
    sorting: string;
    searching: string;
  };

  // Common Controls
  pseudocode: string;
  close: string;
  reset: string;
  stepBack: string;
  play: string;
  pause: string;
  stepForward: string;
  step: string;
  speed: string;
  loopOn: string;
  loopOff: string;
  size: string;
  elements: string;
  randomize: string;
  nearlySorted: string;
  reversed: string;
  newArray: string;
  target: string;
  newTarget: string;
  randomNum: string;

  // Drawer & Metrics
  liveStatus: string;
  timeComplexity: string;
  spaceComplexity: string;
  comparisons: string;
  operations: string;
  swaps: string;
  livePointers: string;
  pseudocodeTitle: string;

  // Structure specific actions
  stack: {
    name: string;
    shortName: string;
    desc: string;
    push: string;
    pop: string;
    peek: string;
    clear: string;
    capacity: string;
    lifo: string;
    top: string;
    base: string;
  };
  queue: {
    name: string;
    shortName: string;
    desc: string;
    enqueue: string;
    dequeue: string;
    peekFront: string;
    clear: string;
    capacity: string;
    fifo: string;
    front: string;
    rear: string;
    egress: string;
    ingress: string;
  };
  linkedList: {
    name: string;
    shortName: string;
    desc: string;
    insertHead: string;
    insertTail: string;
    delete: string;
    search: string;
    sample: string;
    nodeCount: string;
    empty: string;
    newNode: string;
  };
  bst: {
    name: string;
    shortName: string;
    desc: string;
    insert: string;
    search: string;
    sample: string;
    nodeCount: string;
    empty: string;
    inorder: string;
    preorder: string;
    postorder: string;
    levelorder: string;
    visitedOrder: string;
    rule: string;
  };

  // Algorithm Names
  algoNames: Record<string, { name: string; shortName: string; desc: string }>;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  tr: {
    brandName: 'AlgoLab',
    brandTag: '2.0',
    categories: {
      linear: 'Doğrusal Yapılar',
      tree: 'Ağaç Yapıları',
      sorting: 'Sıralama Algoritmaları',
      searching: 'Arama Algoritmaları',
    },
    pseudocode: 'Sözde Kod',
    close: 'Kapat',
    reset: 'Başa Dön',
    stepBack: 'Bir Adım Geri',
    play: 'Oynat',
    pause: 'Duraklat',
    stepForward: 'Bir Adım İleri',
    step: 'ADIM',
    speed: 'Hız',
    loopOn: 'Döngü Açık',
    loopOff: 'Döngü Kapalı',
    size: 'Boyut',
    elements: 'Eleman',
    randomize: 'Diziyi Karıştır',
    nearlySorted: 'Neredeyse Sıralı',
    reversed: 'Ters Sıralı',
    newArray: 'Yeni Dizi',
    target: 'ARANAN HEDEF:',
    newTarget: 'Yeni Hedef Seç',
    randomNum: 'Rastgele Sayı',
    liveStatus: 'CANLI ADIM DURUMU',
    timeComplexity: 'Zaman Karmaşıklığı',
    spaceComplexity: 'Alan Karmaşıklığı',
    comparisons: 'Karşılaştırma',
    operations: 'İşlem Sayısı',
    swaps: 'Takas (Swap)',
    livePointers: 'CANLI İŞARETÇİLER',
    pseudocodeTitle: 'SÖZDE KOD (PSEUDOCODE)',
    stack: {
      name: 'Stack (Yığın)',
      shortName: 'Stack',
      desc: 'Son giren ilk çıkar (LIFO - Last In First Out) prensibine sahip doğrusal veri yapısı.',
      push: 'Push',
      pop: 'Pop',
      peek: 'Peek',
      clear: 'Sıfırla',
      capacity: 'Kapasite',
      lifo: 'LIFO (Last In First Out)',
      top: 'TOP',
      base: 'TABAN (INDEX 0)',
    },
    queue: {
      name: 'Queue (Kuyruk)',
      shortName: 'Queue',
      desc: 'İlk giren ilk çıkar (FIFO - First In First Out) prensibine sahip doğrusal veri yapısı.',
      enqueue: 'Enqueue',
      dequeue: 'Dequeue',
      peekFront: 'Peek Front',
      clear: 'Sıfırla',
      capacity: 'Kapasite',
      fifo: 'FIFO (First In First Out)',
      front: 'front',
      rear: 'rear',
      egress: 'ÇIKIŞ (FRONT)',
      ingress: 'GİRİŞ (REAR)',
    },
    linkedList: {
      name: 'Singly Linked List (Tek Yönlü Bağlı Liste)',
      shortName: 'Linked List',
      desc: 'Her düğümün bir değer ve bir sonraki düğümün adresini tuttuğu dinamik veri yapısı.',
      insertHead: 'Başa Ekle',
      insertTail: 'Sona Ekle',
      delete: 'Sil',
      search: 'Ara',
      sample: 'Örnek Liste',
      nodeCount: 'Düğüm Sayısı',
      empty: 'Liste Boş (head = NULL)',
      newNode: 'YENİ DÜĞÜM',
    },
    bst: {
      name: 'Binary Search Tree (İkili Arama Ağacı)',
      shortName: 'BST',
      desc: 'Her düğümün solunda küçüklerin, sağında büyüklerin yer aldığı hiyerarşik ağaç yapısı.',
      insert: 'Ekle',
      search: 'Ara',
      sample: 'Örnek Ağaç',
      nodeCount: 'Düğüm Sayısı',
      empty: 'Ağaç Boş (Root = NULL)',
      inorder: 'In-Order',
      preorder: 'Pre-Order',
      postorder: 'Post-Order',
      levelorder: 'Level-Order (BFS)',
      visitedOrder: 'ZİYARET SIRASI:',
      rule: 'Sol < Kök < Sağ',
    },
    algoNames: {
      'bubble-sort': {
        name: 'Bubble Sort (Baloncuk Sıralaması)',
        shortName: 'Bubble Sort',
        desc: 'Komşu elemanları karşılaştırıp büyük olanları sona kaydıran sıralama algoritması.',
      },
      'selection-sort': {
        name: 'Selection Sort (Seçmeli Sıralama)',
        shortName: 'Selection Sort',
        desc: 'Sıralanmamış kısımdaki en küçük elemanı bulup başa yerleştiren algoritma.',
      },
      'insertion-sort': {
        name: 'Insertion Sort (Araya Ekleme Sıralaması)',
        shortName: 'Insertion Sort',
        desc: 'Her elemanı sıralı taraftaki doğru konumuna kaydıran algoritma.',
      },
      'quick-sort': {
        name: 'Quick Sort (Hızlı Sıralama)',
        shortName: 'Quick Sort',
        desc: 'Bir pivot seçip küçükleri sola büyükleri sağa toplayarak rekürsif sıralayan algoritma.',
      },
      'merge-sort': {
        name: 'Merge Sort (Birleştirmeli Sıralama)',
        shortName: 'Merge Sort',
        desc: 'Diziyi iki eşit yarıya bölüp sıralı şekilde birleştiren kararlı algoritma.',
      },
      'linear-search': {
        name: 'Linear Search (Doğrusal Arama)',
        shortName: 'Linear Search',
        desc: 'Her elemanı sırayla hedef değerle karşılaştıran temel arama yöntemi.',
      },
      'binary-search': {
        name: 'Binary Search (İkili Arama)',
        shortName: 'Binary Search',
        desc: 'Sıralı dizide arama aralığını sürekli yarıya indirerek logaritmik hızda hedef bulan algoritma.',
      },
      'jump-search': {
        name: 'Jump Search (Sıçrama Araması)',
        shortName: 'Jump Search',
        desc: 'Sıralı dizide sabit blok adımlarıyla (√n) sıçrayıp blok içinde arama yapan algoritma.',
      },
      'interpolation-search': {
        name: 'Interpolation Search (Enterpolasyon Araması)',
        shortName: 'Interpolation Search',
        desc: 'Düzgün dağılımlı dizide hedef konumunu formülle hesaplayan O(log log n) algoritma.',
      },
      'exponential-search': {
        name: 'Exponential Search (Üstel Arama)',
        shortName: 'Exponential Search',
        desc: '2’nin kuvvetleri şeklinde üstel sıçrayıp aralığı daraltan ve İkili Arama yapan algoritma.',
      },
    },
  },
  en: {
    brandName: 'AlgoLab',
    brandTag: '2.0',
    categories: {
      linear: 'Linear Structures',
      tree: 'Tree Structures',
      sorting: 'Sorting Algorithms',
      searching: 'Searching Algorithms',
    },
    pseudocode: 'Pseudocode',
    close: 'Close',
    reset: 'Reset',
    stepBack: 'Step Back',
    play: 'Play',
    pause: 'Pause',
    stepForward: 'Step Forward',
    step: 'STEP',
    speed: 'Speed',
    loopOn: 'Loop Enabled',
    loopOff: 'Loop Disabled',
    size: 'Size',
    elements: 'Items',
    randomize: 'Shuffle Array',
    nearlySorted: 'Nearly Sorted',
    reversed: 'Reversed',
    newArray: 'New Array',
    target: 'TARGET VALUE:',
    newTarget: 'Pick New Target',
    randomNum: 'Random Number',
    liveStatus: 'LIVE STEP STATUS',
    timeComplexity: 'Time Complexity',
    spaceComplexity: 'Space Complexity',
    comparisons: 'Comparisons',
    operations: 'Operations',
    swaps: 'Swaps',
    livePointers: 'ACTIVE POINTERS',
    pseudocodeTitle: 'SYNCHRONIZED PSEUDOCODE',
    stack: {
      name: 'Stack Data Structure',
      shortName: 'Stack',
      desc: 'Linear data structure that follows the Last In First Out (LIFO) principle.',
      push: 'Push',
      pop: 'Pop',
      peek: 'Peek',
      clear: 'Reset',
      capacity: 'Capacity',
      lifo: 'LIFO (Last In First Out)',
      top: 'TOP',
      base: 'BASE (INDEX 0)',
    },
    queue: {
      name: 'Queue Data Structure',
      shortName: 'Queue',
      desc: 'Linear data structure that follows the First In First Out (FIFO) principle.',
      enqueue: 'Enqueue',
      dequeue: 'Dequeue',
      peekFront: 'Peek Front',
      clear: 'Reset',
      capacity: 'Capacity',
      fifo: 'FIFO (First In First Out)',
      front: 'front',
      rear: 'rear',
      egress: 'OUT (FRONT)',
      ingress: 'IN (REAR)',
    },
    linkedList: {
      name: 'Singly Linked List',
      shortName: 'Linked List',
      desc: 'Dynamic data structure where each node stores a value and pointer to the next node.',
      insertHead: 'Insert Head',
      insertTail: 'Insert Tail',
      delete: 'Delete',
      search: 'Search',
      sample: 'Sample List',
      nodeCount: 'Node Count',
      empty: 'List Empty (head = NULL)',
      newNode: 'NEW NODE',
    },
    bst: {
      name: 'Binary Search Tree (BST)',
      shortName: 'BST',
      desc: 'Hierarchical tree structure where left subtree has smaller values and right has greater.',
      insert: 'Insert',
      search: 'Search',
      sample: 'Sample Tree',
      nodeCount: 'Node Count',
      empty: 'Tree Empty (Root = NULL)',
      inorder: 'In-Order',
      preorder: 'Pre-Order',
      postorder: 'Post-Order',
      levelorder: 'Level-Order (BFS)',
      visitedOrder: 'VISITED ORDER:',
      rule: 'Left < Parent < Right',
    },
    algoNames: {
      'bubble-sort': {
        name: 'Bubble Sort',
        shortName: 'Bubble Sort',
        desc: 'Simple comparison sort that repeatedly steps through the list and swaps adjacent elements.',
      },
      'selection-sort': {
        name: 'Selection Sort',
        shortName: 'Selection Sort',
        desc: 'In-place comparison sort that finds the minimum element and moves it to the beginning.',
      },
      'insertion-sort': {
        name: 'Insertion Sort',
        shortName: 'Insertion Sort',
        desc: 'Iterative sorting algorithm that places elements in their correct relative position.',
      },
      'quick-sort': {
        name: 'Quick Sort',
        shortName: 'Quick Sort',
        desc: 'Divide-and-conquer algorithm that partitions array around a chosen pivot element.',
      },
      'merge-sort': {
        name: 'Merge Sort',
        shortName: 'Merge Sort',
        desc: 'Stable divide-and-conquer algorithm that divides list into halves and merges them.',
      },
      'linear-search': {
        name: 'Linear Search',
        shortName: 'Linear Search',
        desc: 'Sequential search that inspects every element until a target match is found.',
      },
      'binary-search': {
        name: 'Binary Search',
        shortName: 'Binary Search',
        desc: 'Logarithmic search that halves the search space at every step in a sorted array.',
      },
      'jump-search': {
        name: 'Jump Search',
        shortName: 'Jump Search',
        desc: 'Block-jumping search (√n) that jumps fixed intervals and backtracks linearly.',
      },
      'interpolation-search': {
        name: 'Interpolation Search',
        shortName: 'Interpolation Search',
        desc: 'Probing search that calculates target position mathematically in uniformly distributed arrays.',
      },
      'exponential-search': {
        name: 'Exponential Search',
        shortName: 'Exponential Search',
        desc: 'Search algorithm that bounds range by powers of 2 and performs binary search.',
      },
    },
  },
};
