function CheckboxSVGIcon({
  className = '',
  isChecked = true,
}: {
  className?: string;
  isChecked?: boolean;
}) {
  return (
    <svg
      width='16'
      height='16'
      viewBox='0 0 16 16'
      fill='none'
      className={className}
      xmlns='http://www.w3.org/2000/svg'>
      <g id='Group 427318225'>
        <path
          id='Rectangle 14 (Stroke)'
          fillRule='evenodd'
          clipRule='evenodd'
          d='M0.5 4.25C0.5 2.17893 2.17893 0.5 4.25 0.5H11.75C13.8211 0.5 15.5 2.17893 15.5 4.25V11.75C15.5 13.8211 13.8211 15.5 11.75 15.5H4.25C2.17893 15.5 0.5 13.8211 0.5 11.75V4.25ZM4.25 2C3.00736 2 2 3.00736 2 4.25V11.75C2 12.9926 3.00736 14 4.25 14H11.75C12.9926 14 14 12.9926 14 11.75V4.25C14 3.00736 12.9926 2 11.75 2H4.25Z'
        />
        {isChecked && (
          <path
            id='Vector (Stroke)'
            fillRule='evenodd'
            clipRule='evenodd'
            d='M11.4801 5.17385C11.7984 5.43903 11.8413 5.91195 11.5762 6.23016L7.82617 10.7302C7.69524 10.8873 7.50583 10.9841 7.30181 10.9982C7.09778 11.0124 6.89683 10.9425 6.7455 10.805L4.4955 8.75952C4.18901 8.48089 4.16642 8.00655 4.44505 7.70006C4.72368 7.39357 5.19802 7.37098 5.50451 7.64961L7.17512 9.16834L10.4238 5.26988C10.689 4.95167 11.1619 4.90868 11.4801 5.17385Z'
          />
        )}
      </g>
    </svg>
  );
}

export default CheckboxSVGIcon;
