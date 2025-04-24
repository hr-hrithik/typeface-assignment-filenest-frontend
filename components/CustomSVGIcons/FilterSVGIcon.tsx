function FilterSVGIcon({ className }: { className?: string }) {
  return (
    <svg
      width='100%'
      height='100%'
      viewBox='0 0 24 24'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M6 12H18M3 6H21M9 18H15'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
}

export default FilterSVGIcon;
