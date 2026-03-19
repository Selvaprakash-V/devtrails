import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import './AnimatedList.css';

function AnimatedItem({ children, index, delay = 0, onHover, onClick }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.5 });

  return (
    <motion.div
      ref={ref}
      data-index={index}
      onMouseEnter={onHover}
      onClick={onClick}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0 }}
      transition={{ duration: 0.18, delay }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {children}
    </motion.div>
  );
}

function defaultRenderItem(item) {
  if (typeof item === 'string') return item;
  if (item && typeof item === 'object' && typeof item.text === 'string') return item.text;
  return String(item);
}

export default function AnimatedList({
  items = [],
  onItemSelect,
  renderItem,
  getItemKey,
  className = '',
  itemClassName = '',
  showGradients = true,
  displayScrollbar = true,
  initialSelectedIndex = -1,
  maxHeight = 260,
  enableArrowNavigation = true,
  ariaLabel = 'Animated list',
}) {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemHover = useCallback((index) => setSelectedIndex(index), []);

  const handleItemClick = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      onItemSelect?.(item, index);
    },
    [onItemSelect]
  );

  const handleScroll = useCallback((e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 50, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 50, 1));
  }, []);

  const scrollSelectedIntoView = useCallback(
    (nextIndex) => {
      const container = listRef.current;
      if (!container) return;
      const selectedItem = container.querySelector(`[data-index="${nextIndex}"]`);
      if (!selectedItem) return;

      const extraMargin = 42;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: 'smooth' });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({ top: itemBottom - containerHeight + extraMargin, behavior: 'smooth' });
      }
    },
    []
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!enableArrowNavigation) return;
      if (items.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = Math.min((selectedIndex < 0 ? -1 : selectedIndex) + 1, items.length - 1);
        setSelectedIndex(next);
        scrollSelectedIntoView(next);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const next = Math.max((selectedIndex < 0 ? 0 : selectedIndex) - 1, 0);
        setSelectedIndex(next);
        scrollSelectedIntoView(next);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          onItemSelect?.(items[selectedIndex], selectedIndex);
        }
      }
    },
    [enableArrowNavigation, items, onItemSelect, scrollSelectedIntoView, selectedIndex]
  );

  useEffect(() => {
    if (!listRef.current) return;
    handleScroll({ target: listRef.current });
  }, [handleScroll, items.length]);

  return (
    <div className={`al-container ${className}`.trim()}>
      <div
        ref={listRef}
        className={`al-list ${!displayScrollbar ? 'al-no-scrollbar' : ''}`}
        style={{ maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight }}
        onScroll={handleScroll}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={ariaLabel}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={getItemKey ? getItemKey(item, index) : (typeof item === 'string' ? item : index)}
            index={index}
            delay={0.03 * Math.min(index, 10)}
            onHover={() => handleItemHover(index)}
            onClick={() => handleItemClick(item, index)}
          >
            {renderItem ? (
              <div className={`al-item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`.trim()}>
                {renderItem(item, { index, isSelected: selectedIndex === index })}
              </div>
            ) : (
              <div className={`al-item ${selectedIndex === index ? 'selected' : ''} ${itemClassName}`.trim()}>
                <p className="al-item-text">{defaultRenderItem(item)}</p>
              </div>
            )}
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div className="al-top-gradient" style={{ opacity: topGradientOpacity }} />
          <div className="al-bottom-gradient" style={{ opacity: bottomGradientOpacity }} />
        </>
      )}
    </div>
  );
}
